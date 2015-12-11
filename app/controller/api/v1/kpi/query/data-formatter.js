"use strict";

const moment = require('moment');
const _ = require('lodash');
const wrap = require('co').wrap;
const defaultOpts = {
  dateFormat: 'YYYY-MM-DD'
};

exports.format = wrap(function*(result, opts) {
  let options = _.merge({}, defaultOpts, opts);
  console.log(result);
  let sorted = _.sortBy(result, (item) => {
    let time = moment(item.created).valueOf();
    return Math.min(time);
  });
  let formatted = _.countBy(sorted, (item) => {
    return moment(item.created).format(options.dateFormat);
  });
  let created = {
    x: [],
    y: []
  };
  let prevDate = null;
  _.forEach(formatted, (val, key) => {
    if ( moment(key).diff(prevDate, 'days') === 1 ) {
      created.x.push(key);
      created.y.push(val);
    } else {
      created.x.push(moment(key).add(-1, 'days').format('YYYY-MM-DD'));
      created.y.push(0);
      created.x.push(key);
      created.y.push(val);
    }
    prevDate = moment(key);
  });
  return created;
});

exports.promiseFormat = wrap(function*(result, opts) {
  let options = _.merge({}, defaultOpts, opts);
  console.log(result);
  let created = {
    x: [],
    y: []
  };
  try {
    let sorted = yield new Promise((resolve, reject) => {
      let _sorted = _.sortBy(result, (item) => {
        let time = moment(item.created).valueOf();
        return Math.min(time);
      });
      console.log('--- finish sort ---');
      resolve(_sorted);
    });
    console.log(sorted);
    let formatted = yield new Promise((resolve, reject) => {
      let _formatted = _.countBy(sorted, (item) => {
        return moment(item.created).format(options.dateFormat);
      });
      console.log('--- finish format ---');
      resolve(_formatted);
    });
    console.log(formatted);
    yield new Promise((resolve, reject) => {
      resolve(_.forEach(formatted, (val, key) => {
        created.x.push(key);
        created.y.push(val);
      }));
    });
  } catch (e) {
    console.log('--- error on promise format ---');
    console.log(e);
  }
  return created;
})
