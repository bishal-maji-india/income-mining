// errorHandler
const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  let title, message;

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      title = "Validation Fail";
      break;
    case constants.NOT_FOUND:
      title = "Not Found";
      break;
    case constants.UNAUTHORIZED:
      title = "Unauthorized Access";
      break;
    case constants.SERVER_ERROR:
      title = "Server Problem";
      break;
    case constants.FORBIDDEN:
      title = "Access Denied";
      break;
    default:
      title = "Unknown Error";
      break;
  }

  message = err.message || "Something went wrong";
  res.status(statusCode).json({ status: "error", title, message, stackTrace: err.stack });
};

module.exports = errorHandler;
