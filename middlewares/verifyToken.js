const jwt = require("jsonwebtoken");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
module.exports = (req, res, next) => {
  const authHeaders =
    req.headers["Authorization"] || req.headers["authorization"];
  if (!authHeaders) {
    const error = appError.create(
      400,
      "token is required",
      httpStatusText.FAIL
    );
    return next(error);
  }
  const token = authHeaders.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = decodedToken;
    next();
  } catch (err) {
    const error = appError.create(
      401,
      "token is invalid, please login again",
      httpStatusText.ERROR
    );
    return next(error);
  }
};
