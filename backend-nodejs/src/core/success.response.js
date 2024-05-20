"use strict";

class SuccessResponse {
    constructor({ message, status, metadata }) {
        this.message = message;
        this.status = status;
        this.metadata = metadata;
    }
    send(res, headers = {}) {
        return res.status(this.status).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({ message = "OK", metadata }) {
        super({ message, status: 200, metadata });
    }
}

class CREATED extends SuccessResponse {
    constructor({ message = "Created", metadata }) {
        super({ message, status: 201, metadata });
    }
};

class UPDATED extends SuccessResponse {
    constructor({ message = "Updated", metadata }) {
        super({ message, status: 201, metadata });
    }
};

module.exports = {
    OK,
    CREATED,
    UPDATED
};
