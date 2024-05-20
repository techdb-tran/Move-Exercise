"use strict";

const { OK } = require("../core/success.response");
const NotificationService = require("../services/notifications.service");

const PAGE = 1;
const LIMIT = 12;

class NotiController {
  setupNoti = async (req, res) => {
    const { user_id } = req.key_store;
    const { follow_notifications, comment_notifications } = req.body;
    new OK({
      metadata: await NotificationService.settingsNoti({
        user_id,
        follow_notifications,
        comment_notifications,
      }),
    }).send(res);
  };

  getSettingsNoti = async (req, res) => {
    new OK({
      metadata: await NotificationService.getSettingsNoti(
        req.key_store.user_id
      ),
    }).send(res);
  };

  countUnreadNoti = async (req, res) => {
    const { user_id } = req.key_store;
    new OK({
      metadata: await NotificationService.countUnreadNotifications(user_id),
    }).send(res);
  };

  getAllNoti = async (req, res) => {
    const { user_id } = req.key_store;
    const { page, page_size } = req.query;
    new OK({
      metadata: await NotificationService.getAllNotications(
        user_id,
        +page || PAGE,
        +page_size || LIMIT
      ),
    }).send(res);
  };
}

module.exports = new NotiController();
