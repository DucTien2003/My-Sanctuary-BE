const _ = require('lodash');

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
  return number < 10 ? '0' + number : number;
};

const showQuantity = (number) => {
  return number >= 1000 ? (number / 1000).toFixed(1) + 'k' : number;
};

const isEmpty = (value) => {
  return (
    value === null || // check for null
    value === undefined || // check for undefined
    value === '' || // check for empty string
    (Array.isArray(value) && value.length === 0) || // check for empty array
    (typeof value === 'object' && Object.keys(value).length === 0) // check for empty object
  );
};

// Sort by last number of string
const sortByLastNumber = (arr, ascending = false) => {
  return arr.sort((a, b) => {
    // Split the string by spaces and get the last element
    const numA = parseFloat(a.split(' ').pop());
    const numB = parseFloat(b.split(' ').pop());

    return ascending ? numB - numA : numA - numB;
  });
};

// Remove slash at the end of string
const removeEndSlash = (str) => {
  return str.replace(/\/+$/, '');
};

module.exports = {
  addZero,
  isEmpty,
  showQuantity,
  removeEndSlash,
  sortByLastNumber,
  convertToCamelCase,
};
