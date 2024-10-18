const httpStatus = require('http-status');

function responseHandler(res, data, message = 'success', statusCode = httpStatus.OK) {
  res.status(statusCode).send({ success: true, message, data });
}

module.exports = {
  responseHandler
};
