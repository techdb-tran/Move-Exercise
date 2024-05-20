"use strict";

const _ = require("lodash");

class FilterObject {
  static getInfoData = ({ fileds = [], object = {} }) => {
    return _.pick(object, fileds);
  };
}

module.exports = FilterObject;
