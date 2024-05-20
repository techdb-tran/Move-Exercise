"use strict";
const { Op, where, Sequelize } = require("sequelize");

const db = require("../models/index");
const { BAD_REQUEST } = require("../core/error.response");
const Notification = require("../utils/notification");
const { NotificationTypeEnum } = require("../constants/enums");
const { DATE } = require("../constants/date");

class FollowsService {
  static getFollowedUserIds = async (currentUserId) => {
    const followedUserIds = await db.follower.findAll({
      where: { follower_user_id: currentUserId },
      attributes: ["followed_user_id", "created_at"],
    });
    return followedUserIds;
  };

  static getFollowedUserIdInfo = async (userId) => {
    const userInfo = await db.user.findByPk(userId, {
      attributes: [
        "id",
        "username",
        "fullname",
        "avatar_url",
        "is_verified",
        "is_actived",
        "email",
      ],
    });
    return userInfo;
  };

  static getNewVideos = async (userId) => {
    const newVideos = await db.video.findAll({
      where: {
        user_id: userId,
        created_at: { [Op.gt]: DATE.THREE_DAYS_AGO },
        title: { [Op.ne]: null },
        duration_time: { [Op.ne]: null },
        is_hide: false,
      },
      attributes: ["id", "user_id", "createdAt", "title"],
    });
    return newVideos;
  };

  static getVideoStatusAndViews = async (currentUserId, newVideos) => {
    const videoStatusAndViews = await Promise.all(
      newVideos.map(async (video) => {
        // Kiểm tra xem currentUserId đã xem video này chưa
        const isViewed = await db.ViewVideo.findOne({
          where: {
            user_id: currentUserId,
            video_id: video.id,
          },
        });

        // Nếu chưa xem, đánh dấu là video mới và chưa xem
        const isNewAndUnviewed = !isViewed;

        return {
          id: video.id,
          isNewAndUnviewed,
          // total_views: totalViews,
        };
      })
    );
    return videoStatusAndViews;
  };

  static countTotalVideos = async (userId) => {
    const { count, rows } = await db.video.findAndCountAll({
      where: {
        user_id: userId,
        title: { [Op.ne]: null },
        duration_time: { [Op.ne]: null },
        is_hide: false,
      },
      attributes: [
        [Sequelize.fn("sum", Sequelize.col("count_view")), "total_views"],
      ],
    });

    return {
      totalVideosCount: count,
      totalViews: rows.length > 0 ? rows[0].dataValues.total_views : 0,
    };
  };

  static paginateResults = (data, page, pageSize) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    const paginatedData = data.slice(startIndex, endIndex);

    const totalResults = data.length;
    const totalPages = Math.ceil(totalResults / pageSize);

    const paginationInfo = {
      totalResults,
      currentPage: parseInt(page),
      totalPages,
    };

    return {
      pagination: paginationInfo,
      data: paginatedData,
    };
  };

  static getFollowedChannels = async (currentUserId, page, pageSize) => {
    // Step 1: Lấy danh sách followed_user_ids từ bảng followers
    const followedUserIds = await this.getFollowedUserIds(currentUserId);
    // Step 2: Lấy thông tin của các followed_user_id và video mới của họ
    const followedChannels = await Promise.all(
      followedUserIds.map(async (followedUser) => {
        const { followed_user_id } = followedUser;
        // Lấy thông tin của followed_user_id
        const followedUserIdInfo = await this.getFollowedUserIdInfo(
          followed_user_id
        );
        // Lấy danh sách video mới của followed_user_id (trong vòng 3 ngày gần nhất)

        const newVideos = await this.getNewVideos(followed_user_id);

        // Check status new video đã được currentUserId xem chưa và lấy tổng số lượt xem của từng video mới
        const videoStatusAndViews = await this.getVideoStatusAndViews(
          currentUserId,
          newVideos
        );

        // Đếm số lượng video mới và chưa xem
        const newVideosCount = videoStatusAndViews.filter(
          (video) => video.isNewAndUnviewed
        ).length;

        // Lấy tổng số video của kênh (followed_user_id)
        const { totalVideosCount, totalViews } = await this.countTotalVideos(
          followed_user_id
        );

        // Trả về thông tin của followed_user_id và video của họ + trạng thái xem
        return {
          ...followedUserIdInfo.toJSON(),
          videos: videoStatusAndViews,
          followedAt: followedUser.dataValues.created_at,
          videoInfo: {
            newVideosCount,
            totalVideosCount,
            totalViews,
          },
        };
      })
    );

    // Step 3: Sắp xếp các kênh theo yêu cầu
    followedChannels.sort((a, b) => {
      // 1. More new and unwatched videos will be prioritized at the top
      if (a.videoInfo.newVideosCount !== b.videoInfo.newVideosCount) {
        return b.videoInfo.newVideosCount - a.videoInfo.newVideosCount;
      }

      // 2. If the number of new videos is equal or there are no new videos, then the channel with the higher total views will be ranked at the top
      // const getTotalViews = (videos) =>
      //   videos.reduce((total, video) => total + video.total_views, 0);
      // const aTotalViews = getTotalViews(a.videos);
      // const bTotalViews = getTotalViews(b.videos);
      // if (aTotalViews !== bTotalViews) {
      //   return bTotalViews - aTotalViews;
      // }

      if (a.videoInfo.totalViews !== b.videoInfo.totalViews) {
        return b.videoInfo.totalViews - a.videoInfo.totalViews;
      }

      // 3. If the views of both channels are equal, the most recent followed will be displayed at the top
      const aFollowedAt = new Date(a.followedAt);
      const bFollowedAt = new Date(b.followedAt);
      if (aFollowedAt.getTime() !== bFollowedAt.getTime()) {
        return bFollowedAt.getTime() - aFollowedAt.getTime();
      }

      // 4. If the duration of follow-up is equal, then arrange in alphabetical order a-z.
      const aUsername = a.username || a.email;
      const bUsername = b.username || b.email;
      if (aUsername !== bUsername) {
        return aUsername.localeCompare(bUsername);
      }
      return 0;
    });

    // paginated responses
    const response = this.paginateResults(followedChannels, page, pageSize);

    return response;
  };

  static followUser = async (follower_user_id, followed_user_id) => {
    if (follower_user_id === followed_user_id) {
      throw new BAD_REQUEST();
    }

    const follower = await db.follower.findOne({
      where: {
        follower_user_id,
        followed_user_id,
      },
    });

    if (follower) {
      await Promise.all([
        db.Notification.destroy({
          where: {
            user_id_from: follower_user_id,
            user_id_to: followed_user_id,
            notification_type: NotificationTypeEnum.FOLLOW,
          },
        }),

        follower.destroy(),
      ]);
      return;
    }

    await Promise.all([
      db.follower.create({
        follower_user_id,
        followed_user_id,
      }),
      Notification.pushNotification(
        follower_user_id,
        followed_user_id,
        NotificationTypeEnum.FOLLOW
      ),
    ]);
  };

  static getFollowUser = async (follower_user_id, followed_user_id) => {
    const follower = await db.follower.findOne({
      where: {
        follower_user_id,
        followed_user_id,
      },
    });

    return follower ? true : false;
  };

  static checkFollowCategory = async (user_id, category_id) => {
    const userFollowCategory = await db.UserFollowerCategory.findOne({
      where: {
        user_id,
        category_id,
      },
    });

    return { isFollowed: userFollowCategory ? true : false };
  };

  static followCategory = async (user_id, category_id) => {
    const userFollowCategory = await db.UserFollowerCategory.findOne({
      where: {
        user_id,
        category_id,
      },
    });

    if (userFollowCategory) {
      await db.UserFollowerCategory.destroy({
        where: {
          category_id,
          user_id,
        },
      });
      return { isFollowed: false };
    } else {
      await db.UserFollowerCategory.create({
        category_id,
        user_id,
      });
      return { isFollowed: true };
    }
  };
}

module.exports = FollowsService;
