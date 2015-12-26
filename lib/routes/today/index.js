const express = require('express');
const app = module.exports = express();
const todayController = require('./today-controller.js')

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/today', function (req, res) {
  console.log('\n--> /today...');
  todayController.getTodayPage(res);
});