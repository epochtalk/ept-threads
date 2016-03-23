var dbc = require('epochtalk-core-pg')({ conString: process.env.DATABASE_URL });
var db = dbc.db;
var helper = dbc.helper;

module.exports = function(threadId) {
  threadId = helper.deslugify(threadId);
  var q = 'SELECT t.board_id, (SELECT title FROM posts WHERE thread_id = t.id ORDER BY created_at LIMIT 1) as title FROM threads t WHERE t.id = $1';
  return db.sqlQuery(q, [threadId])
  .then(function(rows) {
    if (rows.length > 0) { return rows[0]; }
    else { return {}; }
  })
  .then(helper.slugify);
};
