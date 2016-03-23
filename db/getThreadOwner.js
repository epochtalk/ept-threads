var Promise = require('bluebird');
var dbc = require('epochtalk-core-pg')({ conString: process.env.DATABASE_URL });
var db = dbc.db;
var helper = dbc.helper;
var NotFoundError = Promise.OperationalError;

module.exports = function(threadId) {
  threadId = helper.deslugify(threadId);
  var q = 'SELECT user_id FROM posts WHERE thread_id = $1 ORDER BY created_at LIMIT 1';
  return db.sqlQuery(q, [threadId])
  .then(function(rows) {
    if (rows.length > 0) { return rows[0]; }
    else { throw new NotFoundError('Thread Not Found'); }
  })
  .then(helper.slugify);
};
