var dbc = require('epochtalk-core-pg')({ conString: process.env.DATABASE_URL });
var db = dbc.db;
var helper = dbc.helper;

module.exports = function(threadId, locked) {
  threadId = helper.deslugify(threadId);
  var lock = 'UPDATE threads SET locked = $1 WHERE id = $2;';
  return db.sqlQuery(lock, [locked, threadId]);
};
