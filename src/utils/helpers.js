const _ = require("lodash");
const databaseService = require("../services/databaseService");

const convertToCamelCase = (obj) => {
  if (_.isArray(obj)) {
    return obj.map((v) => convertToCamelCase(v));
  } else if (_.isObject(obj)) {
    return _.mapKeys(obj, (value, key) => _.camelCase(key));
  }
  return obj;
};

// Add zero
const addZero = (number) => {
  return number < 10 ? "0" + number : number;
};

const showQuantity = (number) => {
  return number >= 1000 ? (number / 1000).toFixed(1) + "k" : number;
};

const isEmpty = (value) => {
  if (value === null || value === undefined) {
    return true; // check for null or undefined
  }
  if (typeof value === "string" || typeof value === "number") {
    return value === ""; // check for empty string or number
  }
  if (Array.isArray(value)) {
    return value.length === 0 || value.every(isEmpty); // check for empty array or array of empty values
  }
  if (typeof value === "object") {
    return (
      Object.keys(value).length === 0 || Object.values(value).every(isEmpty)
    ); // check for empty object or object with empty values
  }

  return false;
};

// Sort by last number of string
const sortByLastNumber = (arr, order = false) => {
  return arr.sort((a, b) => {
    // Split the string by spaces and get the last element
    const numA = parseFloat(a.split(" ").pop());
    const numB = parseFloat(b.split(" ").pop());

    return order ? numB - numA : numA - numB;
  });
};

// Remove slash at the end of string
const removeEndSlash = (str) => {
  return str.replace(/\/+$/, "");
};

// Reformat path
const formatPath = (path) => {
  return path
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
};

module.exports = {
  addZero,
  isEmpty,
  formatPath,
  showQuantity,
  removeEndSlash,
  sortByLastNumber,
  convertToCamelCase,
};
