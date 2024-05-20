"use strict";

const { OK } = require("../core/success.response");
const AnalyticsService = require("../services/analytics.service");

const PAGE = 1;
const LIMIT = 20;

class AnalyticsController {
  videoAnalytics = async (req, res) => {
    const { user_id } = req.key_store;
    const { start_date, end_date, sort_by, sort_order, page, page_size } =
      req.validatedData;

    new OK({
      metadata: await AnalyticsService.analyzeVideos({
        user_id,
        start_date,
        end_date,
        sort_by,
        sort_order,
        page: +page || PAGE,
        limit: +page_size || LIMIT,
      }),
    }).send(res);
  };

  videoStat = async (req, res) => {
    const { video_id } = req.validatedData;
    const { user_id } = req.key_store;

    new OK({
      metadata: await AnalyticsService.getVideoStat(video_id, user_id),
    }).send(res);
  };

  overview = async (req, res) => {
    const { user_id } = req.key_store;

    const [total_followers, total_video_views, average_view_time] =
      await Promise.all([
        AnalyticsService.getTotalFollowers(user_id),
        AnalyticsService.getTotalVideoViews(user_id),
        AnalyticsService.getAvgViewTime(user_id),
      ]);

    new OK({
      metadata: { total_followers, total_video_views, average_view_time },
    }).send(res);
  };

  latestVideo = async (req, res) => {
    new OK({
      metadata: await AnalyticsService.latestVideoStatistics(
        req.key_store.user_id
      ),
    }).send(res);
  };

  analyzeGenderViewsForVideo = async (req, res) => {
    const { user_id } = req.key_store;
    const { video_id } = req.params;
    const { days_ago } = req.validatedData;

    new OK({
      metadata: await AnalyticsService.analyzeGenderViewsForVideo(
        video_id,
        user_id,
        days_ago
      ),
    }).send(res);
  };

  analyzeAgeViewsForVideo = async (req, res) => {
    const { user_id } = req.key_store;
    const { video_id } = req.params;
    const { days_ago } = req.validatedData;

    new OK({
      metadata: await AnalyticsService.analyzeAgeViewsForVideo(
        video_id,
        user_id,
        days_ago
      ),
    }).send(res);
  };

  analyzeCountryViewsForVideo = async (req, res) => {
    const { user_id } = req.key_store;
    const { video_id } = req.params;
    const { days_ago } = req.validatedData;

    new OK({
      metadata: await AnalyticsService.analyzeCountryViewsForVideo(
        video_id,
        user_id,
        days_ago
      ),
    }).send(res);
  };

  analyzeStateViewsForVideo = async (req, res) => {
    const { user_id } = req.key_store;
    const { video_id } = req.params;
    const { days_ago, country_code } = req.validatedData;

    new OK({
      metadata: await AnalyticsService.analyzeStateViewsForVideo(
        video_id,
        user_id,
        days_ago,
        country_code
      ),
    }).send(res);
  };
}

module.exports = new AnalyticsController();
