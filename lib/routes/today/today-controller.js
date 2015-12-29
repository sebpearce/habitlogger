'use strict';

const express = require('express');
const app = module.exports = express();
const pg = require('pg');
const _ = require('lodash');
const getFns = require('../../helpers/get');
const kit = require('../../helpers/kit');

// set up DB connection
var conString = "pg://seb@localhost:5432";
var client = new pg.Client(conString);
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
    const doingsSQL = { 
      text: 'SELECT doings.id, doings.date, habits.id AS habit, doings.value, habits.type FROM doings JOIN habits ON doings.habit = habits.id JOIN habit_types ON habits.type = habit_types.id WHERE doings.date = $1',
      values: [currentDate],
    };
    const habitsSQL = 'SELECT habits.id, habits.name, habits.type FROM habits ORDER BY habits.id';

    getFns.getTable(results, doingsSQL, 'doings', function () {
      getFns.getTable(results, habitsSQL, 'habits', function () {
        _.merge(opts, {
          doings: results['doings'],
          habits: results['habits'],
          todayCheckedList: createTodayCheckedList(results['doings']),
        });
        kit.formatValues(opts.todayCheckedList);
        console.log('opts', opts);
        res.render('today', opts);
        if (callback) callback();
      });
    });

  },

  updateTodayHabit(req, res) {

    const doneHabit = req.body.doneHabit;
    const value = req.body.value;
    const habitType = req.body.type;
    const now = new Date();
    const currentDate = kit.getYYYYMMDD(now);

    const sqlUpdate = 'UPDATE doings SET value = $3 ' + 
                      'WHERE date = $1 AND habit = $2 ; ';

    const sqlInsert = 'INSERT INTO doings (date, habit, value) ' + 
                      'SELECT $1, $2, $3 WHERE NOT EXISTS ' + 
                      '(SELECT id FROM doings WHERE date = $1 AND habit = $2)';

    const sql = {
      // text: 'UPDATE doings SET value = $1 WHERE habit = $2',
      text: sqlUpdate,
      values: [currentDate, doneHabit, value]
    }

    client.query(sql, function (err, result) {
      console.log('working...');
      if (err) {
        console.error(err);
        console.log('Failed round 1 (SQL update); trying new query...');
        sql.text = sqlInsert;
        client.query(sql, function (err, result) {
          if (err) {
            console.error(err);
            console.log('Failed round 2 (SQL insert).');
            res.status(400).json({ 
              error: 'Could not update.',
            });
          } else {
            console.log('success on round 2 (insert)!');
            res.json({ 
              success: true,
              updatedHabit: doneHabit,
              formattedValue: kit.convertValueToType(value, habitType),
            });
          }
        });
      } else {
        console.log('success on round 1 (update)!');
        res.json({ 
          success: true,
          updatedHabit: doneHabit,
          formattedValue: kit.convertValueToType(value, habitType),
        });
      }
    });

  },

};