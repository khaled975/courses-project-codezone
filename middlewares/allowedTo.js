const appError = require("../utils/appError");

module.exports = (...roles) => {
  return (req, res, next) => {
    console.log(req.currentUser);

    if (!roles.includes(req.currentUser.role)) {
      const error = appError.create(
        401,
        "you are not in authorized role to make this action"
      );
      return next(error);
    }
    return next();
  };
};
