const express = require('express');
const app = module.exports = express();
const habitsController = require('./habits-controller.js')

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/habits/list', function (req, res) {
  habitsController.listHabits(res);
});

app.get('/habits', function (req, res) {
  console.log('\n--> /habits...');
  habitsController.getHabitsPage(res);
});

app.post('/habits/add', function (req, res) {
  console.log('\n--> /habits/add... (POST)');
  habitsController.addHabit(req, res);
});

app.post('/habits/delete', function (req, res) {
  console.log('\n--> /habits/delete... (POST)');
  habitsController.deleteHabit(req, res);
});