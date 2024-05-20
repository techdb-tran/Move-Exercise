"use strict";

const { RES_MESSAGE } = require("../constants/message");
const { NOT_FOUND } = require("../core/error.response");
const { OK } = require("../core/success.response");
const FeaturedCarouselService = require("../services/featured_carousel.service");
const VideoService = require("../services/video.service");

class FeaturedCarouselController {
  view = async (req, res, next) => {
    new OK({
      metadata: await FeaturedCarouselService.find(),
    }).send(res);
  };

  add = async (req, res, next) => {
    const id = req.params.id;

    const video = await VideoService.findById(id);

    if (video.length === 0) {
      throw new NOT_FOUND(RES_MESSAGE.VIDEO_NOT_FOUND);
    }

    new OK({
      metadata: await FeaturedCarouselService.addFeaturedVideo(id),
    }).send(res);
  };

  remove = async (req, res, next) => {
    const id = req.params.id;

    const video = await VideoService.findById(id);

    if (video.length === 0) {
      throw new NOT_FOUND(RES_MESSAGE.VIDEO_NOT_FOUND);
    }

    new OK({
      metadata: await FeaturedCarouselService.removeFeaturedVideo(id),
    }).send(res);
  };
}

module.exports = new FeaturedCarouselController();
