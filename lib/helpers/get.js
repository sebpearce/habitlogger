'use strict';

const express = require('express');
const app = express();
const pg = require('pg');
const _ = require('lodash');

// set up DB connection
var conString = "pg://seb@localhost:5432";
var client = new pg.Client(conString);
client.connect();

module.exports = {

  getTable (results, sql, table, next) {
    client.query(sql, function (err, result) {
      if (err) {
        console.log('error!!!!');
        console.error(err);
        res.send("Error " + err);
      } else {
        results[table] = result.rows;
        next();
      }
    });
  },

  getHabitTypes (next) {
    // kit.log('\nStarting getHabitTypes...');
    const locals = {
      habitTypes: {}
    };
    const sql = 'SELECT * FROM habit_types';
    client.query(sql, function (err, result) {
      if (err) {
        console.error(err);
        res.send("Error " + err);
      }
      // set habitTypes as hash of ids and habit types
      _.each(result.rows, function (el) {
        locals.habitTypes[el.id] = el.name;
      });
      // kit.log(locals);
      next(null, locals);
    });
  },

  // load habits
  getHabitsTable (next) {
    // kit.log('\nStarting getHabitsTable...');
    const locals = {
      habits: {}
    };
    const sql = 'SELECT habits.id, habits.name, habits.type, habit_types.name AS type_name FROM habits JOIN habit_types ON habits.type = habit_types.id ORDER BY id';
    client.query(sql, function (err, result) {
      if (err) {
        console.error(err);
        res.send("Error " + err);
      }
      locals.habits = result.rows;
      // kit.log(locals);
      next(null, locals);
    });
  },

  getDoingsTable (next) {
    const locals = {
      doings: {}
    };
    const sql = 'SELECT doings.id, doings.date, habits.name AS habit, doings.value, habits.type AS type FROM doings JOIN habits ON doings.habit = habits.id ORDER BY doings.date';
    client.query(sql, function (err, result) {
      if (err) {
        console.error(err);
        res.send('Error ' + err);
      }
      locals.doings = result.rows;
      // kit.log(locals, 'locals');
      next(null, locals);
    });
  }

};

