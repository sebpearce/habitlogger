const express = require('express');
const app = module.exports = express();
const dbController = require('./db-controller.js')

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/db', function (req, res) {
  console.log('\n--> /db...');
  dbController.getDB(res);
});