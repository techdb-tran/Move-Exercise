"use strict";

const { RES_MESSAGE } = require("../constants/message");
const { REGEX } = require("../constants/regex");
const { BAD_REQUEST } = require("../core/error.response");
const { OK } = require("../core/success.response");
const CategoriesService = require("../services/categories.service");
const UserService = require("../services/user.service");
const VideoService = require("../services/video.service");

class SearchsController {
  instantSearch = async (req, res, next) => {
    let searchTerm = req.query.search_query;

    searchTerm = searchTerm.replace(REGEX.SEARCH_QUERY_REGEX, "").trim();

    if (searchTerm === "" || searchTerm === undefined) {
      new OK({
        metadata: [],
      }).send(res)
    }

    const categories = await CategoriesService.searchCategories(searchTerm);

    let perPage = 5 - categories.length;

    const users = await UserService.searchUsers(searchTerm, perPage);

    perPage = perPage - users.length;

    const videos = await VideoService.searchVideos(searchTerm, perPage);

    let metadata = { categories, users, videos };

    new OK({
      metadata,
    }).send(res);
  };

  searchResult = async (req, res, next) => {
    let searchTerm = req.query.search_query;

    searchTerm = searchTerm.replace(REGEX.SEARCH_QUERY_REGEX, "").trim();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
    if (searchTerm === "" || searchTerm === undefined) {
      new OK({
        metadata: [],
      }).send(res);
    }

    const categories = await CategoriesService.searchCategories(searchTerm);

    const users = await UserService.searchUsers(searchTerm, 8);

    const videos = await VideoService.searchVideos(searchTerm, 6);

    let metadata = { categories, users, videos };

    new OK({
      metadata,
    }).send(res);
  };
}

module.exports = new SearchsController();
