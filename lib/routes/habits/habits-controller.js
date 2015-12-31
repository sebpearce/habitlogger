const express = require('express');
const app = module.exports = express();
const pg = require('pg');
const _ = require('lodash');
const getFns = require('../../helpers/get');
const db = require('../../helpers/db');

// set up DB connection
var client = new pg.Client(db.path);
client.connect();

module.exports = {

  listHabits (res, callback) {
    const opts = {};
    getFns.getHabitTypes(function (err, habitTypes) {
        _.merge(opts, habitTypes);
      getFns.getHabitsTable(function (err, habits) {
        _.merge(opts, habits);
        res.json(opts);
      });
    });
  },

  getHabitsPage (res, callback) {
    const opts = {
      pageTitle: 'Habits',
    };
    res.render('habits', opts);
  },

  addHabit (req, res) {
    const newHabitName = req.body.newHabit;
    const newHabitType = req.body.newHabitType;
    const sql = {
      text: 'INSERT INTO habits (name, type) VALUES ($1, $2);',
      values: [newHabitName, newHabitType],
    };
    client.query(sql, function (err, result) {
      if (err) {
        console.error(err);
        res.status(400).json({ 
          error: 'Could not add habit.',
        });
      } else {
        res.json({ 
          success: true,
        });
      }
    });
  },

  deleteHabit (req, res) {
    const idToDelete = req.body.habitToDelete;
    const sql = {
      text: 'DELETE FROM habits WHERE id = $1;',
      values: [idToDelete],
    };
    client.query(sql, function (err, result) {
      if (err) {
        console.error(err);
        res.status(400).json({
          error: 'Could not delete habit.',
        });
      } else {
        res.json({
          success: true,
        });
      }
    });
  },

};

