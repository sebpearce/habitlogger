'use strict';

const express = require('express');
const app = module.exports = express();
const pg = require('pg');
const _ = require('lodash');
const getFns = require('../../helpers/get');
const kit = require('../../helpers/kit');
const db = require('../../helpers/db');
const generateCalendar = require('./calendar');

// set up DB connection
var client = new pg.Client(db.path);
client.connect();


function createTodayCheckedList (doings) {
  const output = {};
  for (let row of doings) {
    // if the doing has been done
    if (row.value > 0) {
      output[row['habit']] = {
        value: row['value'],
        type: row['type'],
        id: row['id'],
      };
    }
  }
  return output;
}

module.exports = {

  getTodayPage (res, callback) {

    const opts = {
      pageTitle: 'Today',
    };

    const results = {};

    // get all doings with today's date
    const now = new Date();
    const currentDate = kit.getYYYYMMDD(now);
    const aYearAgo = new Date();
    aYearAgo.setDate(now.getDate() - 365);
    const aYearAgoYYYYMMDD = kit.getYYYYMMDD(aYearAgo);
    const yearDoingsSQL = {
      text: 'SELECT date, count(*) FROM doings WHERE date >= $1 GROUP BY date',
      values: [aYearAgoYYYYMMDD],
    };
    const todaysDoingsSQL = { 
      text: 'SELECT doings.id, doings.date, habits.id AS habit, doings.value, habits.type FROM doings JOIN habits ON doings.habit = habits.id JOIN habit_types ON habits.type = habit_types.id WHERE doings.date = $1',
      values: [currentDate],
    };
    const habitsSQL = 'SELECT habits.id, habits.name, habits.type FROM habits ORDER BY habits.id';

    getFns.getTable(results, yearDoingsSQL, 'yearDoings', function () {
      getFns.getTable(results, todaysDoingsSQL, 'todaysDoings', function () {
        getFns.getTable(results, habitsSQL, 'habits', function () {
          // restructure yearDoings for progress calendar
          const progCalData = {};
          for (let row of results['yearDoings']) {
            progCalData[row.date] = row.count;
          }
          _.merge(opts, {
            progCalHTML: generateCalendar(progCalData, results['habits'].length),
            // todaysDoings: results['todaysDoings'],
            habits: results['habits'],
            todayCheckedList: createTodayCheckedList(results['todaysDoings']),
          });
          kit.formatValues(opts.todayCheckedList);
          // console.log('opts', opts);
          res.render('today', opts);
          if (callback) callback();
        });
      });
    });
  },

  updateTodayHabit(req, res) {

    const doneHabit = req.body.doneHabit;
    const value = req.body.value;
    const habitType = req.body.type;
    const now = new Date();
    const currentDate = kit.getYYYYMMDD(now);

    const sql = {
      text: 'INSERT INTO doings (date, habit, value) VALUES ($1, $2, $3) ' + 
            'ON CONFLICT ON CONSTRAINT date_habit_unique ' +
            'DO UPDATE SET value = $3',
      values: [currentDate, doneHabit, value]
    }

    client.query(sql, function (err, result) {
      console.log('working...');
      if (err) {
        console.error(err);
        res.status(400).json({ 
          error: 'Could not update.',
        });
      } else {
        console.log('success on updating db!');
        const buf = {
          success: true,
          updatedHabit: doneHabit,
        }
        buf.formattedValue = 
          habitType != 3 ? kit.convertValueToType(value, habitType) : '',
        res.json(buf);
      }
    });

  },

  deleteTodayHabit(req, res) {

    const habitId = req.body.habit;
    const date = kit.getYYYYMMDD(new Date());

    const sql = {
      text: 'DELETE FROM doings WHERE habit = $1 AND date = $2',
      values: [habitId, date],
    };

    client.query(sql, function (err, result) {
      if (err) {
        console.error(err);
        res.status(400).json({ 
          error: 'Could not delete.',
        });
      } else {
        res.json({ 
          success: true,
        });
      }
    });    

  },

};