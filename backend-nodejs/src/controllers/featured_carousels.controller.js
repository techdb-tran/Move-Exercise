"use strict";

const { OK } = require("../core/success.response");
const FeaturedCarouselService = require("../services/featured_carousel.service");

class FeaturedCarouselController {
  view = async (req, res, next) => {
    new OK({
      metadata: await FeaturedCarouselService.find(),
    }).send(res);
  };
}

module.exports = new FeaturedCarouselController();
