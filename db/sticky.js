var dbc = require('epochtalk-core-pg')({ conString: process.env.DATABASE_URL });
var db = dbc.db;
var helper = dbc.helper;

module.exports = function(threadId, sticky) {
  threadId = helper.deslugify(threadId);
  var stick = 'UPDATE threads SET sticky = $1 WHERE id = $2;';
  return db.sqlQuery(stick, [sticky, threadId]);
};
