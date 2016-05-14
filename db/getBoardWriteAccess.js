var path = require('path');
var Promise = require('bluebird');
var dbc = require(path.normalize(__dirname + '/db'));
var db = dbc.db;
var helper = dbc.helper;
var NotFoundError = Promise.OperationalError;

module.exports = function(threadId, userPriority) {
  threadId = helper.deslugify(threadId);

  var q =
  `SELECT b.postable_by
  FROM boards b
  LEFT JOIN threads t ON t.board_id = b.id
  WHERE t.id = $1`;
  return db.sqlQuery(q, [threadId])
  .then(function(rows) {
    if (rows.length > 0 ) { return rows[0].postable_by; }
    else { throw new NotFoundError(); }
  })
  .then(function(postable_by) {
    var postable = false;
    if (postable_by === null || postable_by === undefined) { postable = true; }
    else if (typeof postable_by === 'number' && userPriority <= postable_by) { postable = true; }
    return postable;
  })
  .error(function() { return false; });
};
