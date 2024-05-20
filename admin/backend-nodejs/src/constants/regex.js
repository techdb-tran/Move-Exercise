const REGEX = {
  PASSWORD_REGEX:
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
  IMAGE_REGEX: "\\.(jpg|JPG|jpeg|JPEG|png|PNG)$",
  USER_NAME_REGEX: "^[a-zA-Z0-9]+$",
  SEARCH_QUERY_REGEX: /[^\w\s\u00C0-\u024F]/gi,
  WORLD_START_CHARACTER_REGEX: /\b\w/g,
  UNDERSCORE_REGEX_GLOBAl: /_/g,
  WHITESPACE_REGEX_GLOBAL: /\s/g,
};

module.exports = {
  REGEX,
};
