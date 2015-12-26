const express = require('express');
const app = module.exports = express();
const pg = require('pg');
const _ = require('lodash');
// const getFns = require('../../helpers/get');

// set up DB connection
var conString = "pg://seb@localhost:5432";
var client = new pg.Client(conString);
client.connect();

module.exports = {
  getTodayPage (res) {
    const opts = {
      pageTitle: 'Today',
    };
    res.render('today', opts);
  },
};