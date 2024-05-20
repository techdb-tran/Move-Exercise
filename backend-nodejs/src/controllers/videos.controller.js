"use strict";

const { OK } = require("../core/success.response");
const VideoService = require("../services/video.service");

const PAGE = 1;
let LIMIT = 20;

class VideosController {
  videoYouMayLike = async (req, res, next) => {
    const user_id = req.headers["client-id"];
    let page = req.query.page || 1;
    new OK({
      metadata: await VideoService.videoYouMayLike(user_id, page),
    }).send(res);
  };

  watchAlso = async (req, res) => {
    new OK({
      metadata: await VideoService.getRelatedVideos(req.params.video_id),
    }).send(res);
  };

  topVideos = async (req, res) => {
    const { category, level, sort_by, sort_order, page, page_size } = req.query;
    const filters = { category, level, sort_by, sort_order };
    new OK({
      metadata: await VideoService.getAllVideos(
        filters,
        +page || PAGE,
        +page_size || LIMIT
      ),
    }).send(res);
  };

  videoList = async (req, res) => {
    const { page_size, page } = req.query;
    const { user_id } = req.key_store;
    new OK({
      metadata: await VideoService.videoList(
        user_id,
        page_size || LIMIT,
        page || PAGE
      ),
    }).send(res);
  };

  deleteVideo = async (req, res) => {
    const { user_id } = req.key_store;
    new OK({
      metadata: await VideoService.deleteVideo(req.body.video_id, user_id),
    }).send(res);
  };

  videoListOfCategory = async (req, res) => {
    const { sort_by, sort_order, page, page_size, level } = req.query;
    const { cate_id } = req.params;
    const filters = { sort_by, sort_order, cate_id, level };
    new OK({
      metadata: await VideoService.getAllVideos(
        filters,
        +page || PAGE,
        +page_size || LIMIT
      ),
    }).send(res);
  };

  viewVideoOfUser = async (req, res) => {
    const id = req.params.user_id;
    const { page_size, page } = req.validatedData;

    new OK({
      metadata: await VideoService.viewVideoOfUser(
        id,
        +page || PAGE,
        page_size || LIMIT
      ),
    }).send(res);
  };
}

module.exports = new VideosController();
