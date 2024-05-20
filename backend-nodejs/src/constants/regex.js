const REGEX = {
  PASSWORD_REGEX:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`~!@#$%^&*()-_+={}[\]|\\:;"'<>,.?/ ])[A-Za-z\d`~!@#$%^&*()-_+={}[\]|\\:;"'<>,.?/ ]{8,16}$/,
  IMAGE_REGEX: "\\.(jpg|JPG|jpeg|JPEG|png|PNG|JFIF|jfif)$",
  USER_NAME_REGEX: "^[a-zA-Z0-9]+$",
  SEARCH_QUERY_REGEX: /[^\w\s\u00C0-\u024F]/gi,
};

module.exports = {
  REGEX,
};
