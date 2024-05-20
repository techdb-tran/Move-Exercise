"use strict";

const { RES_MESSAGE } = require("../constants/message");
const { NOT_FOUND } = require("../core/error.response");
const db = require("../models/index");
const { Op } = require("sequelize");

class NotificationService {
  static create = (id) => {
    return db.UserSettingNotification.create({
      user_id: id,
      follow_notifications: true,
      comment_notifications: true,
    });
  };

  static settingsNoti = async ({
    user_id,
    follow_notifications,
    comment_notifications,
  }) => {
    let userSettings = await db.UserSettingNotification.findOne({
      where: { user_id },
    });

    if (!userSettings) {
      userSettings = await db.UserSettingNotification.create({
        user_id,
      });
    }

    userSettings.follow_notifications = follow_notifications;
    userSettings.comment_notifications = comment_notifications;

    await userSettings.save();
    return userSettings;
  };

  static getSettingsNoti = async (user_id) => {
    const userSettings = await db.UserSettingNotification.findOne({
      where: { user_id },
    });

    if (!userSettings) {
      throw new NOT_FOUND(RES_MESSAGE.NOTI_SETTINGS_NOT_FOUND);
    }

    return userSettings;
  };

  static countUnreadNotifications = async (user_id) => {
    const count = await db.Notification.count({
      where: {
        user_id_to: user_id,
        is_read: false,
        user_id_from: {
          [Op.ne]: user_id,
        },
      },
    });
    return count;
  };

  static getAllNotications = async (user_id, page, pageSize) => {
    const offset = (page - 1) * pageSize;
    const notifications = await db.Notification.findAll({
      where: {
        user_id_to: user_id,
        user_id_from: {
          [Op.ne]: user_id,
        },
      },
      include: [
        {
          model: db.user,
          attributes: ["id", "username", "fullname", "avatar_url"],
        },
      ],
      attributes: [
        "id",
        "is_read",
        "notification_type",
        "notification_content_id",
        "created_at",
        "updated_at",
      ],
      limit: pageSize,
      offset: offset,
      order: [["created_at", "DESC"]],
    });

    // Get a list of IDs of unread notifications
    const unreadNotificationIds = notifications.reduce((acc, notification) => {
      if (!notification.is_read) {
        acc.push(notification.id);
      }
      return acc;
    }, []);

    // Update the status of unread notifications to 'true'
    await db.Notification.update(
      { is_read: true },
      {
        where: {
          id: unreadNotificationIds,
        },
      }
    );

    return notifications;
  };
}

module.exports = NotificationService;
