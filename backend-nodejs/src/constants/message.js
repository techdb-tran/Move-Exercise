const RES_MESSAGE = {
  CREATE_SUCCESSFULLY: "User created successfully",
  LOGIN_SUCCESSFULLY: "User logged in successfully",
  LOGOUT_SUCCESSFULLY: "User logged out successfully",
  USER_UPDATE_SUCCESSFULLY: "User updated successfully",
  DELETE_SUCCESSFULLY: "User deleted successfully",
  EMAIL_ALREADY_EXISTSTS: "Email already exists",
  USER_NOT_FOUND: "User not found",
  USER_ALREADY_ACTIVATED: "User already activated",
  USER_NOT_ACTIVATED: "User not activated",
  INVALID_OTP: "The OTP code is incorrect",
  OTP_NOT_FOUND:
    "The OTP code has expired. Please resend the verification code to try again",
  OTP_VERIFIED: "OTP verified successfully",
  OTP_RESEND_SUCCESSFULLY: "OTP resend successfully",
  OTP_RESEND_FAILED: "OTP resend failed",
  OTP_NOT_SET: "Could not set OTP to Redis",
  INVALID_PUBLIC_KEY: "Invalid public key",
  SERVER_ERROR: "Invalid server error",
  WRONG_PASSWORD_FORMAT:
    "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
  FORGOT_PASSWORD_SUCCESS: "Password reset email sent successfully",
  SENT_FORGOT_PASSWORD_SUCCESS: "Please reset your password",
  TOKEN_NOT_FOUND: "Token not found or expired",
  PASSWORD_RESET_SUCESS: "Password reset successfully",
  WRONG_PASSWORD: "Invalid password",
  USER_BANNED: "User already banned",
  USER_NOT_LOGIN: "User not logged in",
  PERMABANNED: "Perma banned",
  OTP_ALREADY_SET: "User already have an active OTP",
  FORGOT_PW_TOKEN_VALID: "Forgot password reset token is valid",
  USERNAME_ALREADY_IN_USE: "Username already in use",
  WRONG_KEYWORD: "Wrong search keyword",
  NO_DATA_AVAILABLE: "No data available",
  VIDEO_NOT_FOUND_OR_NOT_OWNER_OF_THIS_VIDEO:
    "Video not found or you are not the owner of this video",
  COMMENT_NOT_FOUND: "Comment not found",
};

const VIDEO_RES_MESSAGE = {
  GET_VIDEO_WATCH_ALSO_SUCCESS: "Get related videos successfully",
  NOT_FOUND: "Video not found",
};

const NOTI_RES_MESSAGE = {
  SETTING_SUCCESS: "Notification settings updated successfully.",
  NOTI_SETTINGS_NOT_FOUND: "Notification settings not found for this user.",
};

const ANALYTICS_MESSAGE = {
  PERMISSION: "You don't have permission to view the stats of this video",
};

module.exports = {
  RES_MESSAGE,
  VIDEO_RES_MESSAGE,
  NOTI_RES_MESSAGE,
  ANALYTICS_MESSAGE,
};
