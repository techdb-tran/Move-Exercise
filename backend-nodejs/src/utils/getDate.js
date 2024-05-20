"use strict";

const { Op } = require("sequelize");

class GetDate {
  static getDateRangeCondition = (startDate, endDate) => {
    let filterCondition = {};
    if (startDate && endDate) {
      filterCondition = {
        created_at: {
          [Op.between]: [startDate, endDate],
        },
      };
    }
    return filterCondition;
  };
}

module.exports = GetDate;
