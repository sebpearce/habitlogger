
const db = {
  name: 'seb',
  host: 'localhost',
  port: '5432',
  database: 'habitlogger',
};

db.path = 'pg://' + db.name + '@' + db.host + ':' + db.port + '/' + db.database;

module.exports = db;