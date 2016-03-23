var dbc = require('epochtalk-core-pg')({ conString: process.env.DATABASE_URL });
var db = dbc.db;
var helper = dbc.helper;

module.exports = function(threadId) {
  threadId = helper.deslugify(threadId);
  var increment = 'UPDATE metadata.threads SET views = views + 1 WHERE thread_id = $1';
  return db.sqlQuery(increment, [threadId]);
};
