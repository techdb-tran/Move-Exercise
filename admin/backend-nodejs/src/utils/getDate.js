"use strict";

const { Op } = require("sequelize");

class GetDate {
  static getDateRangeCondition = (startDate, endDate) => {
    let whereCondition = {};

    if (!endDate) {
      endDate = new Date();
    }

    if (startDate && !endDate) {
      endDate = new Date();
    }

    if (startDate) {
      whereCondition.created_at = {
        [Op.between]: [startDate, endDate],
      };
    }

    return whereCondition;
  };
}

module.exports = GetDate;
