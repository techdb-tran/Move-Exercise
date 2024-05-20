const VideoLevelEnum = Object.freeze({
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
});

const VideoDurationEnum = Object.freeze({
  LESS_THAN_30_MINS: "less_than_30_mins",
  LESS_THAN_1_HOUR: "less_than_1_hour",
  MORE_THAN_1_HOUR: "more_than_1_hour",
});

const NotificationTypeEnum = Object.freeze({
  FOLLOW: "follow",
  COMMENT: "comment",
  REPLY_COMMENT: "reply_comment",
});

module.exports = {
  VideoLevelEnum,
  VideoDurationEnum,
  NotificationTypeEnum,
};
