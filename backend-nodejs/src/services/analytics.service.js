"use strict";

const db = require("../models/index");
const { Sequelize, Op } = require("sequelize");
const { FORBIDDEN, NOT_FOUND } = require("../core/error.response");
const { RES_MESSAGE } = require("../constants/message");

const Calculate = require("../utils/caculator");
const Convert = require("../utils/convert");
const GetDate = require("../utils/getDate");

class AnalyticsService {
  static queryCondition = () => {
    return {
      attributes: [
        "id",
        "title",
        "thumbnail",
        "count_view",
        "duration",
        "duration_time",
        "level",
        "category_id",
        "user_id",
        "url",
        [
          Sequelize.literal(
            '(SELECT name FROM categories WHERE id = "video"."category_id")'
          ),
          "category_name",
        ],
        [
          Sequelize.literal(`
            COALESCE(
              LEAST(
                (SELECT AVG(time) FROM view_videos WHERE video_id = video.id),
                video.duration_time
              ),
              0
            )
          `),
          "average_view_time",
        ],
        [
          Sequelize.literal(`
          COALESCE(
            LEAST(
              (SELECT AVG(time) FROM view_videos WHERE video_id = video.id) * 100 / video.duration_time,
              100
            ),
            0
          )
        `),
          "percentage_viewed",
        ],
        [
          Sequelize.fn(
            "COALESCE",
            Sequelize.literal(
              '(SELECT AVG(rate) FROM rate_videos WHERE video_id = "video"."id")'
            ),
            0
          ),
          "average_rates",
        ],
        "created_at",
        "updated_at",
      ],
    };
  };

  // function get video info from database
  static getInfoVideo = async (video_id, user_id) => {
    const video = await db.video.findOne({
      where: {
        id: video_id,
        user_id,
        title: {
          [Op.ne]: null,
        },
        duration_time: {
          [Op.ne]: null,
        },
      },
    });

    if (!video) {
      throw new FORBIDDEN(
        RES_MESSAGE.VIDEO_NOT_FOUND_OR_NOT_OWNER_OF_THIS_VIDEO
      );
    }

    return video;
  };

  // function to get the date before a number of days
  static getDateAgo = (days_ago) => {
    if (!days_ago) return null;

    const dateAgo = new Date();
    dateAgo.setDate(dateAgo.getDate() - days_ago);
    return dateAgo;
  };

  static getVideoViews = async (video_id, dateAgo, country_code = null) => {
    const views = await db.ViewVideo.findAll({
      where: {
        video_id,
        ...(dateAgo && { created_at: { [Op.gte]: dateAgo } }),
        ...(country_code && { "$user.country$": country_code }),
      },
      include: {
        model: db.user,
        attributes: ["id", "state", "gender", "birthday", "country"],
        required: false,
      },
    });
    return views;
  };

  static getVideoStat = async (video_id, user_id) => {
    const queryCondition = this.queryCondition();

    return db.video.findOne({
      where: {
        user_id: user_id,
        id: video_id,
        title: {
          [Op.ne]: null,
        },
        duration_time: {
          [Op.ne]: null,
        },
        is_hide: false,
      },
      ...queryCondition,
    });
  };

  static analyzeVideos = async ({
    user_id,
    start_date,
    end_date = new Date(),
    sort_by,
    sort_order = "DESC",
    page,
    limit,
  }) => {
    const filterCondition = GetDate.getDateRangeCondition(start_date, end_date);
    const queryCondition = this.queryCondition();

    const orderConditions = [];
    let query = "";

    switch (sort_by) {
      case "average_view_time":
        query = `(SELECT AVG(time) FROM view_videos WHERE video_id = video.id)`;
        break;
      case "percentage_viewed":
        query = `(SELECT AVG(time) FROM view_videos WHERE video_id = video.id) * 100 / video.duration_time`;
        break;
      case "average_rates":
        query = `(SELECT AVG(rate) FROM rate_videos WHERE video_id = video.id)`;
        break;
      case "views":
        orderConditions.push(["count_view", sort_order]);
        break;
      default:
        query = "";
    }

    if (query) {
      orderConditions.push([Sequelize.literal(query), sort_order]);
    }
    orderConditions.push(["created_at", sort_order]);

    const offset = (page - 1) * limit;

    const [stats, totalVideos] = await Promise.all([
      // Query to get video stats
      db.video.findAll({
        ...queryCondition,
        where: {
          user_id,
          title: {
            [Op.ne]: null,
          },
          duration_time: {
            [Op.ne]: null,
          },
          ...filterCondition,
        },
        order: orderConditions,
        limit: limit,
        offset: offset,
      }),

      // Query to count total videos
      db.video.count({
        where: {
          user_id,
          title: {
            [Op.ne]: null,
          },
          duration_time: {
            [Op.ne]: null,
          },
          ...filterCondition,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalVideos / limit);

    return {
      total_videos: totalVideos,
      current_page: page,
      page_size: limit,
      total_pages: totalPages,
      stats: stats,
    };
  };

  static getTotalFollowers = async (user_id) => {
    const totalFollowers = await db.follower.count({
      where: { followed_user_id: user_id },
    });
    return totalFollowers;
  };

  static getTotalVideoViews = async (user_id) => {
    const userVideos = await db.video.findAll({
      where: {
        user_id,
        title: {
          [Op.ne]: null,
        },
        duration_time: {
          [Op.ne]: null,
        },
      },
    });
    let totalViews = 0;
    userVideos.forEach((video) => (totalViews += video.count_view));
    return totalViews;
  };

  static getAvgViewTime = async (user_id) => {
    const userVideos = await db.video.findAll({ where: { user_id } });

    let totalViewTime = 0;
    let totalVideos = 0;

    for (const video of userVideos) {
      const views = await db.ViewVideo.findAll({
        where: { video_id: video.id },
      });
      for (const view of views) {
        totalViewTime += view.time;
      }
      totalVideos += views.length;
    }

    const averageViewTime = Math.round(
      totalVideos > 0 ? totalViewTime / totalVideos : 0
    );

    return averageViewTime;
  };

  static latestVideoStatistics = async (user_id) => {
    // find the latest video
    const latestVideo = await db.video.findOne({
      where: {
        user_id,
        title: {
          [Op.ne]: null,
        },
        duration_time: {
          [Op.ne]: null,
        },
      },
      order: [["created_at", "DESC"]],
    });

    if (!latestVideo) {
      throw new NOT_FOUND(RES_MESSAGE.NO_DATA_AVAILABLE);
    }

    const [commentCount, replyCount] = await Promise.all([
      db.comment.count({
        where: { video_id: latestVideo.id },
      }),
      db.reply_comment.count({
        include: { model: db.comment, where: { video_id: latestVideo.id } },
      }),
    ]);

    const totalCommentCount = commentCount + replyCount;

    const ratings = await db.RateVideo.findAll({
      where: { video_id: latestVideo.id },
    });

    let totalRating = 0;
    ratings.forEach((rating) => (totalRating += rating.rate));

    const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

    return {
      thumbnail: latestVideo.thumbnail,
      title: latestVideo.title,
      count_view: latestVideo.count_view,
      total_comment: totalCommentCount,
      average_rating: averageRating,
    };
  };

  // function to analyze views by gender
  static analyzeGenderViews = (views) => {
    let male = 0;
    let female = 0;
    let other = 0;
    let unknown = 0;
    let totalViews = views.length;

    views.forEach((view) => {
      switch (view.user?.gender?.toLowerCase()) {
        case "male":
          male++;
          break;
        case "female":
          female++;
          break;
        case "other":
          other++;
          break;
        default:
          unknown++;
          break;
      }
    });

    return { male, female, other, unknown, totalViews };
  };

  static calculateGenderPercentages = (
    male,
    female,
    other,
    unknown,
    totalViews
  ) => {
    const male_percentage = ((male / totalViews) * 100).toFixed(1);
    const female_percentage = ((female / totalViews) * 100).toFixed(1);
    const other_percentage = ((other / totalViews) * 100).toFixed(1);
    const unknown_percentage = ((unknown / totalViews) * 100).toFixed(1);

    return {
      male_percentage,
      female_percentage,
      other_percentage,
      unknown_percentage,
    };
  };

  static analyzeGenderViewsForVideo = async (
    video_id,
    user_id,
    days_ago = null
  ) => {
    await this.getInfoVideo(video_id, user_id);

    // get date ago
    const dateAgo = this.getDateAgo(days_ago);

    const views = await this.getVideoViews(video_id, dateAgo);

    const { male, female, other, unknown, totalViews } =
      this.analyzeGenderViews(views);

    // Tính phần trăm lượt xem theo giới tính
    const genderPercentages = this.calculateGenderPercentages(
      male,
      female,
      other,
      unknown,
      totalViews
    );

    return {
      male,
      female,
      other,
      unknown,
      ...genderPercentages,
      total_views: totalViews,
    };
  };

  static analyzeAgeViews = (views) => {
    let age_under_18 = 0;
    let age_18_24 = 0;
    let age_25_34 = 0;
    let age_35_44 = 0;
    let age_45_54 = 0;
    let age_55_64 = 0;
    let age_64_above = 0;
    let unknown = 0;

    views.forEach((view) => {
      if (view.user && view.user.birthday) {
        const userAge = Calculate.calculateAge(view.user.birthday);
        switch (true) {
          case userAge < 18:
            age_under_18++;
            break;
          case userAge >= 18 && userAge <= 24:
            age_18_24++;
            break;
          case userAge >= 25 && userAge <= 34:
            age_25_34++;
            break;
          case userAge >= 35 && userAge <= 44:
            age_35_44++;
            break;
          case userAge >= 45 && userAge <= 54:
            age_45_54++;
            break;
          case userAge >= 55 && userAge <= 64:
            age_55_64++;
            break;
          default:
            age_64_above++;
            break;
        }
      } else {
        unknown++;
      }
    });

    return {
      age_under_18,
      age_18_24,
      age_25_34,
      age_35_44,
      age_45_54,
      age_55_64,
      age_64_above,
      unknown,
      total_views: views.length,
    };
  };

  static analyzeAgeViewsForVideo = async (
    video_id,
    user_id,
    days_ago = null
  ) => {
    await this.getInfoVideo(video_id, user_id);

    // get date ago
    const dateAgo = this.getDateAgo(days_ago);

    const views = await this.getVideoViews(video_id, dateAgo);

    return this.analyzeAgeViews(views);
  };

  static analyzeCountryViews = (views) => {
    let totalViews = views.length;
    let countryData = {
      Unknown: {
        count: 0,
        percentage: 0,
      },
    };

    views.forEach((view) => {
      if (view.user && view.user.country) {
        const country = view.user.country;
        if (!countryData[country]) {
          countryData[country] = {
            count: 0,
            percentage: 0,
          };
        }
        countryData[country].count++;
      } else {
        countryData["Unknown"].count++;
      }
    });

    // Calculate percentage for each country and unknown
    Object.entries(countryData).forEach(([country, data]) => {
      data.percentage = ((data.count / totalViews) * 100).toFixed(1);
      data.country_code = country;
    });

    return countryData;
  };

  // function sorts country data and gets the 5 countries with the highest number of viewers
  static sortCountryData = (countryData) => {
    const sortedCountryData = Object.entries(countryData)
      .sort(([, data1], [, data2]) => data2.count - data1.count) // sort by number of viewers decreasing
      .filter(([key]) => key !== "Unknown") // remove "Unknown" from the list
      .slice(0, 5) // get 5 countries
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    // add "Unknown" to the end of the list
    sortedCountryData["Unknown"] = countryData["Unknown"];

    return sortedCountryData;
  };

  static addCountryNames = async (countryData) => {
    const countryCodeList = Object.keys(countryData);

    for (const countryCode of countryCodeList) {
      const countryName = await Convert.getCountryNameByCode(countryCode);
      countryData[countryCode].country_name = countryName;
    }

    return countryData;
  };

  static analyzeCountryViewsForVideo = async (
    video_id,
    user_id,
    days_ago = null
  ) => {
    await this.getInfoVideo(video_id, user_id);

    // get date ago
    const dateAgo = this.getDateAgo(days_ago);

    const views = await this.getVideoViews(video_id, dateAgo);

    const countryData = this.analyzeCountryViews(views);

    const sortedCountryData = this.sortCountryData(countryData);

    const countryDataWithNames = await this.addCountryNames(sortedCountryData);

    return countryDataWithNames;
  };

  static sortStateDataByCount = (stateData) => {
    const stateDataArray = Object.entries(stateData);

    stateDataArray.sort((a, b) => b[1].count - a[1].count);

    // Khởi tạo mảng mới để lưu trữ dữ liệu đã sắp xếp
    const sortedStateData = [];
    stateDataArray.forEach(([key, value]) => {
      sortedStateData.push({ [key]: value });
    });

    return sortedStateData;
  };

  static analyzeStateViews = async (views) => {
    let stateData = {};

    for (const view of views) {
      if (view.user && view.user.state) {
        const { state } = view.user;
        if (!stateData[state]) {
          stateData[state] = { count: 0, percentage: 0 };
        }
        stateData[state].count++;
      }
    }

    const totalState = Object.values(stateData).reduce(
      (acc, cur) => acc + cur.count,
      0
    );

    for (const stateKey in stateData) {
      stateData[stateKey].percentage = (
        (stateData[stateKey].count / totalState) *
        100
      ).toFixed(1);
    }

    const sortedStateData = this.sortStateDataByCount(stateData);

    return {
      total_state: totalState,
      stateData: sortedStateData,
    };
  };

  // Function converts stateCode in stateData to stateName
  static getStateNames = async (stateData, countryCode) => {
    const stateNamesData = {};

    for (const stateObj of stateData) {
      const stateCode = Object.keys(stateObj)[0];
      const stateName = await Convert.getStateNameByCode(
        countryCode,
        stateCode
      );
      stateNamesData[stateName] = stateObj[stateCode];
    }

    return stateNamesData;
  };

  // Function to analyze city demographics of users viewing a video
  static analyzeStateViewsForVideo = async (
    video_id,
    user_id,
    days_ago = null,
    country_code = null
  ) => {
    await this.getInfoVideo(video_id, user_id);

    // get date ago
    const dateAgo = this.getDateAgo(days_ago);

    const views = await this.getVideoViews(video_id, dateAgo, country_code);

    const { total_state, stateData } = await this.analyzeStateViews(views);

    const stateNames = await this.getStateNames(stateData, country_code);

    return {
      country_name: await Convert.getCountryNameByCode(country_code),
      total_state,
      state_data: stateNames,
    };
  };
}

module.exports = AnalyticsService;
