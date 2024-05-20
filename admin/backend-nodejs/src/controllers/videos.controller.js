"use strict";

const { RES_MESSAGE } = require("../constants/message");
const { REGEX } = require("../constants/regex");
const { BAD_REQUEST, NOT_FOUND } = require("../core/error.response");
const { CREATED, OK, UPDATED } = require("../core/success.response");
const VideoService = require("../services/video.service");

const PAGE = 1;
let LIMIT = 20;

class VideoController {
  overView = async (req, res, next) => {
    const { startDate, endDate } = req.query;
    new OK({
      metadata: await VideoService.countVideoView(startDate, endDate),
    }).send(res);
  };

  viewList = async (req, res, next) => {
    let {
      page_size,
      page,
      startDate,
      endDate,
      filters,
      searchTerm = "",
      hide
    } = req.query;

    new OK({
      metadata: await VideoService.videoList(
        page_size || LIMIT,
        page || PAGE,
        startDate,
        endDate,
        filters,
        searchTerm,
        hide
      ),
    }).send(res);
  };

  deleteVideos = async (req, res, next) => {
    const video_ids = req.body.video_id;
    const videos = await VideoService.findById(video_ids);

    if (videos.length < video_ids.length)
      throw new NOT_FOUND(RES_MESSAGE.VIDEO_NOT_FOUND);

    new OK({
      metadata: await VideoService.deleteVideos(video_ids),
    }).send(res);
  };

  hideVideo = async (req, res, next) => {
    const video_id = req.params.video_id;
    new OK({
      metadata: await VideoService.hideVideo(video_id),
    }).send(res);
  };

}

module.exports = new VideoController();
