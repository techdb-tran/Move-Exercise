const { RES_MESSAGE } = require("../constants/message");
const { OK } = require("../core/success.response");
const UserService = require("../services/user.service");

const PAGE = 1;
const LIMIT = 15;

class UserController {
  dataUsers = async (req, res) => {
    const { page, limit, sort_by, sort_order, filter_country, search } =
      req.validatedData;
    new OK({
      message: RES_MESSAGE.GET_LIST_USERS_SUCCESS,
      metadata: await UserService.getUsers({
        page: +page || PAGE,
        limit: +limit || LIMIT,
        sort_by: sort_by,
        sort_order: sort_order,
        filter_country: filter_country,
        search: search,
      }),
    }).send(res);
  };

  exportUsers = async (req, res) => {
    const { sort_by, sort_order, filter_country, search } = req.query;
    const csvData = await UserService.getUsersDataAndConverToCSV({
      sort_by: sort_by,
      sort_order: sort_order,
      filter_country: filter_country,
      search: search,
    });
    res.header("Content-Type", "text/csv");
    res.attachment("users.csv");
    res.send(csvData);
  };

  countTotalView = async (req, res) => {
    const id = req.params.id;

    new OK({
      metadata: await UserService.countTotalView(id),
    }).send(res);
  };
}

module.exports = new UserController();
