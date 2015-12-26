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

module.exports = {

  listDoings (res) {
    const opts = {};
    getFns.getDoingsTable(function (err, doings) {
      _.merge(opts, doings);

      // format timed values
      kit.log(opts, 'opts');
      kit.formatValues(opts.doings);

      res.json(opts);
    })
  },

  getDoingsPage (res) {
    const opts = {
      pageTitle: 'Doings',
    };
    getFns.getHabitsTable(function (err, habits) {
      if (err) {
        console.error(err);
        res.status(400).json({
          error: 'Could not load doings.',
        });
      } else {
        _.merge(opts, habits);
        res.render('doings', opts);
      }
    });
  },

  addDoing (req, res) {
    const newDoingDate = req.body.newdoingdate;
    const newDoingHabit = req.body.newdoinghabit;
    const newDoingValue = req.body.newdoingvalue;

    const sql = {
      text: 'INSERT INTO doings (date, habit, value) VALUES ($1, $2, $3);',
      values: [newDoingDate, newDoingHabit, newDoingValue],
    };

    client.query(sql, function (err, result) {
      if (err) {
        console.error(err);
        res.status(400).json({ 
          error: 'Could not add doing.',
        });
      } else {
        res.json({ 
          success: true,
        });
      }
    });
  },


  deleteDoing (req, res) {
    // TODO: If user tries to delete habit that has referenced keys in doings
    // table, send back a code that prompts them to choose whether they want to
    // delete all the doings rows that reference it, and if they say yes, send
    // back the same delete POST with an added property like "sure: true"
    const idToDelete = req.body.doingtodelete;

    const sql = {
      text: 'DELETE FROM doings WHERE id = $1;',
      values: [idToDelete],
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