
const db = {
  name: 'seb',
  host: 'localhost',
  port: '5432',
  database: 'habitlogger',
};

// For local server:
// db.path = 'pg://' + db.name + '@' + db.host + ':' + db.port + '/' + db.database;

// For Heroku:
db.path = process.env.DATABASE_URL;

module.exports = db;