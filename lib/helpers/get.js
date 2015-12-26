'use strict';

const express = require('express');
const app = express();
const pg = require('pg');
const _ = require('lodash');

// set up DB connection
var conString = "pg://seb@localhost:5432";
// var conString = 'postgres://seb@localhost/database';
var client = new pg.Client(conString);
client.connect();

module.exports = {

  getHabitTypes(next) {
    // kit.log('\nStarting getHabitTypes...');
    const locals = {
      habitTypes: {}
    };
    // set habitTypes as hash of ids and habit types
    // pg.connect(process.env.LOCAL_DATABASE_URL, function(err, client, done) {
      const sql = 'SELECT * FROM habit_types';
      client.query(sql, function (err, result) {
        if (err) {
          console.error(err);
          res.send("Error " + err);
        }
        _.each(result.rows, function (el) {
          locals.habitTypes[el.id] = el.name;
        });
        // kit.log(locals);
        next(null, locals);
      });
    // });
  },

  // load habits
  getHabitsTable(next) {
    // kit.log('\nStarting getHabitsTable...');
    const locals = {
      habits: {}
    };
    // pg.connect(process.env.LOCAL_DATABASE_URL, function(err, client, done) {
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
    // });
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

