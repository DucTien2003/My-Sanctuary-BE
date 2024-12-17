const { isEmpty, convertToCamelCase } = require("../../utils");
const { User } = require("../../models");

const getUserByUserId = async ({ userId }) => {
  const userResult = await User.findByPk(userId);

  const user = userResult ? userResult.dataValues : {};

  return !isEmpty(user) ? { user: convertToCamelCase(user) } : { user: {} };
};

const getUsersByUserIds = async ({
  page,
  limit,
  orderBy,
  sortType,
  userIds,
}) => {
  const { count, rows: usersResult } = await User.findAndCountAll({
    where: { id: userIds },
    order: [[orderBy, sortType]],
    limit: limit > 0 ? limit : undefined, // chỉ áp dụng limit nếu limit > 0
    offset: limit > 0 ? (page - 1) * limit : undefined,
  });

  const users = usersResult.map((user) => user.dataValues);

  return !isEmpty(users)
    ? { users: convertToCamelCase(users), count }
    : { users: [], count: 0 };
};

module.exports = {
  getUsersByUserIds,
  getUserByUserId,
};
