const express = require('express');
const app = module.exports = express();
const indexController = require('./index-controller.js')

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  console.log('\n--> /...');
  indexController.getIndexPage(res);
});