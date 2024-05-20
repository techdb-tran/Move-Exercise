"use strict";

class ErrorResponse extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

class CONFLICT extends ErrorResponse {
  constructor(message = "Conflict") {
    super(409, message);
  }
}

class FORBIDDEN extends ErrorResponse {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

class BAD_REQUEST extends ErrorResponse {
  constructor(message = "Bad Request") {
    super(400, message);
  }
}

class NOT_FOUND extends ErrorResponse {
  constructor(message = "Not Found") {
    super(404, message);
  }
}

class SERVICE_UNAVAILABLE extends ErrorResponse {
  constructor(message = "Service Unavailable") {
    super(503, message);
  }
}

class INTERNAL_SERVER_ERROR extends ErrorResponse {
  constructor(message = "Internal Server Error") {
    super(500, message);
  }
}

class UNPROCESSABLE_ENTITY extends ErrorResponse {
  constructor(message = "Unavailable Entity") {
    super(422, message);
  }
}

class UNAUTHORIZED extends ErrorResponse {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

module.exports = {
  CONFLICT,
  FORBIDDEN,
  BAD_REQUEST,
  NOT_FOUND,
  SERVICE_UNAVAILABLE,
  INTERNAL_SERVER_ERROR,
  UNPROCESSABLE_ENTITY,
  UNAUTHORIZED,
};
