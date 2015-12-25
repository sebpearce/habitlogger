'use strict';

const express = require('express');
const app = express();
const pg = require('pg');
const _ = require('lodash');
const kit = require('./helpers/kit');
const bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// set up DB connection
var conString = "pg://seb@localhost:5432";
// var conString = 'postgres://seb@localhost/database';
var client = new pg.Client(conString);
client.connect();

function getHabitTypes(next) {
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
}

// load habits
function getHabitsTable(next) {
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
}

function getDoingsTable (next) {
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

function convertValueToCounted (v) {
  return '\u00D7 ' + v;
}
function convertValueToBinary (v) {
  return +v ? 'Yes' : 'No';
}

function convertValueToTime (sec) {
  let hr = Math.floor(sec / 3600);
  sec -= hr * 3600;
  hr = (hr >= 1) ? (hr + 'h') : '';
  let min = Math.floor(sec / 60);
  min = (min >= 1) ? (min + 'm') : '';
  let remSec = sec % 60;
  remSec = (remSec !== 0) ? (remSec + 's') : '';
  return hr + min + remSec;
}

function formatValues (obj) {
  for (let row of obj) {
    if (row.type === 1) {
      row.value = convertValueToTime(row.value);
    }    
    if (row.type === 2) {
      row.value = convertValueToCounted(row.value);
    }
    if (row.type === 3) {
      row.value = convertValueToBinary(row.value);
    }
  }
}

// ROUTES

app.get('/', function(req, res) {
  console.log('\n--> /...');
  const opts = {
    pageTitle: 'Index',
  };
  res.render('pages/index', opts);
});

app.get('/doings/list', function (req, res) {
  const opts = {};
  getDoingsTable(function (err, doings) {
    _.merge(opts, doings);

    // format timed values
    kit.log(opts, 'opts');
    formatValues(opts.doings);

    res.json(opts);
  })
});

app.get('/doings', function(req, res) {
  const opts = {
    pageTitle: 'Doings',
  };
  getHabitsTable(function (err, habits) {
    if (err) {
      console.error(err);
      res.status(400).json({
        error: 'Could not load doings.',
      });
    } else {
      _.merge(opts, habits);
      res.render('pages/doings', opts);
    }
  });
});

app.post('/doings/add', function (req, res) {
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
});

// TODO: If user tries to delete habit that has referenced keys in doings table,
// send back a code that prompts them to choose whether they want to delete all
// the doings rows that reference it, and if they say yes, send back the same
// delete POST with an added property like "sure: true"

app.post('/doings/delete', function(req, res) {
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
});


app.get('/habits/list', function (req, res) {
  const opts = {};
  getHabitTypes(function (err, habitTypes) {
      _.merge(opts, habitTypes);
    getHabitsTable(function (err, habits) {
      _.merge(opts, habits);
      res.json(opts);
    });
  });
});

app.get('/habits', function (req, res) {
  console.log('\n--> /habits...');

  const opts = {
    pageTitle: 'Habits',
  };
  res.render('pages/habits', opts);
});

app.post('/habits/add', function (req, res) {
  console.log('\n--> /habits/add... (POST)');

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
});

app.post('/habits/delete', function (req, res) {
  console.log('\n--> /habits/delete... (POST)');

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
});

app.get('/db', function (req, res) {
  console.log('\n--> /db...');

  const opts = {
    pageTitle: 'DB overview',
  };

  // pg.connect(process.env.LOCAL_DATABASE_URL, function(err, client, done) {
    const results = {};

    function getTable (sql, table, cb) {
      client.query(sql, function (err, result) {
        if (err) {
          console.log('error!!!!');
          console.error(err);
          res.send("Error " + err);
        } else {
          console.log(table + ': success!!!!');
          results[table] = result.rows;
          cb();
        }
      });
    }

    const doingsSQL = 'SELECT doings.id, doings.date, habits.name AS habit, doings.value, habit_types.name AS type FROM doings JOIN habits ON doings.habit = habits.id JOIN habit_types ON habits.type = habit_types.id';
    const habitsSQL = 'SELECT habits.id, habits.name, habit_types.name AS type FROM habits JOIN habit_types ON habits.type = habit_types.id ORDER BY habits.id';
    const habitTypesSQL = 'SELECT * FROM habit_types';

    getTable(doingsSQL, 'doings', function () {
      getTable(habitsSQL, 'habits', function () {
        getTable(habitTypesSQL, 'habitTypes', function () {
          _.merge(opts, {
            doings: results['doings'],
            habits: results['habits'],
            habitTypes: results['habitTypes'],
          });
          res.render('pages/db', opts);
        });
      });
    });

  // });

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
