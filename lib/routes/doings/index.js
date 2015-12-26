const express = require('express');
const app = module.exports = express();
const doingsController = require('./doings-controller.js')

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/doings/list', function (req, res) {
  doingsController.listDoings(res);
});

app.get('/doings', function(req, res) {
  doingsController.getDoingsPage(res);
});

app.post('/doings/add', function (req, res) {
  doingsController.addDoing(req, res);
});

app.post('/doings/delete', function(req, res) {
  doingsController.deleteDoing(req, res);
});
