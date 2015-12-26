'use strict';

const express = require('express');
const app = express();
const pg = require('pg');
const _ = require('lodash');
const bodyParser = require('body-parser');

const kit = require('./lib/helpers/kit');
const getFns = require('./lib/helpers/get');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Routes
const indexRoute = require('./lib/routes/index');
const dbRoute = require('./lib/routes/db');
const habitsRoute = require('./lib/routes/habits');
const doingsRoute = require('./lib/routes/doings');
const todayRoute = require('./lib/routes/today');
app.use(indexRoute);
app.use(dbRoute);
app.use(habitsRoute);
app.use(doingsRoute);
app.use(todayRoute);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
