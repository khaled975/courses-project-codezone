module.exports = (controllerAsyncFn) => {
  return (req, res, next) => {
    controllerAsyncFn(req, res, next).catch((error) => next(error));
  };
};
