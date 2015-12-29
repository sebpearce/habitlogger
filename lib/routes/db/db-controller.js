const express = require('express');
const app = module.exports = express();
const pg = require('pg');
const _ = require('lodash');
const getFns = require('../../helpers/get');

// set up DB connection
var conString = "pg://seb@localhost:5432";
// var conString = 'postgres://seb@localhost/database';
var client = new pg.Client(conString);
client.connect();

module.exports.getDB = function (res, callback) {

  const opts = {
    pageTitle: 'DB overview',
  };

  const results = {};

  const doingsSQL = 'SELECT doings.id, doings.date, habits.name AS habit, doings.value, habit_types.name AS type FROM doings JOIN habits ON doings.habit = habits.id JOIN habit_types ON habits.type = habit_types.id';
  const habitsSQL = 'SELECT habits.id, habits.name, habit_types.name AS type FROM habits JOIN habit_types ON habits.type = habit_types.id ORDER BY habits.id';
  const habitTypesSQL = 'SELECT * FROM habit_types';

  getFns.getTable(results, doingsSQL, 'doings', function () {
    getFns.getTable(results, habitsSQL, 'habits', function () {
      getFns.getTable(results, habitTypesSQL, 'habitTypes', function () {
        _.merge(opts, {
          doings: results['doings'],
          habits: results['habits'],
          habitTypes: results['habitTypes'],
        });
        res.render('db', opts);
        if (callback) callback();
      });
    });
  });
}