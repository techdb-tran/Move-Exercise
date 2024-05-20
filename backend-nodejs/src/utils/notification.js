const { NotificationTypeEnum } = require("../constants/enums");
const db = require("../models");

class Notification {
  static notificationSettingsMap = {
    [NotificationTypeEnum.FOLLOW]: "follow_notifications",
    [NotificationTypeEnum.COMMENT]: "comment_notifications",
    [NotificationTypeEnum.REPLY_COMMENT]: "comment_notifications",
  };

  static shouldPushNotificationBasedOnSettings = (
    userSetting,
    notificationType
  ) => {
    // Check if user setting allows notification and notification type is appropriate
    const settingKey = this.notificationSettingsMap[notificationType];
    return !!userSetting && userSetting[settingKey];
  };

  static pushNotification = async (
    user_id_from,
    user_id_to,
    notification_type
  ) => {
    const userSetting = await db.UserSettingNotification.findOne({
      where: {
        user_id: user_id_to,
      },
    });

    if (
      !this.shouldPushNotificationBasedOnSettings(
        userSetting,
        notification_type
      )
    )
      return;

    // push notification
    await db.Notification.create({
      user_id_from,
      user_id_to,
      notification_type,
      is_read: false,
    });
  };
}

module.exports = Notification;
