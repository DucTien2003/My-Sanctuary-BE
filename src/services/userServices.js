const databaseService = require("./databaseService");
const { isEmpty } = require("../utils");

const getUserByUserIdService = async ({ userId }) => {
  const { user } = await databaseService.getUserByUserId({ userId });

  if (isEmpty(user)) {
    return {
      code: 404,
      success: false,
      message: "Id người dùng không tồn tại",
    };
  }

  return {
    code: 200,
    success: true,
    message: "Lấy thông tin người dùng thành công",
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
};

const getUsersByUserIdsService = async ({ userIds }) => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return {
      code: 400,
      success: false,
      message: "userIds không hợp lệ",
    };
  }

  const { users, count } = await databaseService.getUsersByUserIds({ userIds });

  return {
    code: 200,
    success: true,
    message: "Lấy thông tin người dùng thành công",
    users,
    count,
  };
};

module.exports = {
  getUserByUserIdService,
  getUsersByUserIdsService,
};
