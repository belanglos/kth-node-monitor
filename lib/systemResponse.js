"use strict";

const httpResponse = require("./httpResponse");

const keys = {
  REDIS: "redis",
  LDAP: "ldap",
  MONGO_DB: "mongodb",
  SQL_DB: "sqldb"
};

const worksOrfailed = (key, options, testWorked) => {
  if (testWorked) {
    return works(key, options);
  }
  return failed(key, options);
};

const works = (key, options) => {
  return getResponse(key, httpResponse.statusCodes.OK, options);
};

const failed = (key, option) => {
  return getResponse(
    key,
    httpResponse.statusCodes.SERVICE_UNAVAILABLE,
    options
  );
};

const getResponse = (key, statusCode, options) => {
  return {
    key: key,
    statusCode: statusCode,
    required: isRequired(options),
    message: getMessage(key, statusCode, isRequired(options))
  };
};

function getMessage(key, statusCode, required) {
  if (httpResponse.isOk(statusCode)) {
    return `- ${key}: OK (Required to work: ${required})`;
  }

  if (required) {
    return `- ${key}: ${httpResponse.getStatusName(
      statusCode
    )}. This service has to work for the APPLICATION_STATUS to say OK.`;
  }

  return `- ${key}: ${httpResponse.getStatusName(
    statusCode
  )}. The application can function without this service.`;
}

const isRequired = options => {
  if (options == null) {
    return false;
  }

  if (options.required == null) {
    return false;
  }
  return ("" + options.required).toLowerCase() === "true";
};

/**
 * Module exports
 */
module.exports = {
  keys: keys,
  works: works,
  failed: failed,
  worksOrfailed: worksOrfailed
};