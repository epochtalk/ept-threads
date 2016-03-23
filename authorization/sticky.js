var Boom = require('boom');
var Promise = require('bluebird');

module.exports = function threadsSticky(server, auth, threadId) {
  var userId = auth.credentials.id;

  // check base permission
  var allowed = server.authorization.build({
    error: Boom.forbidden(),
    type: 'hasPermission',
    server: server,
    auth: auth,
    permission: 'threads.sticky.allow'
  });

  var conditions = [
    {
      // permission based override
      type: 'hasPermission',
      server: server,
      auth: auth,
      permission: 'threads.sticky.bypass.owner.admin'
    },
    {
      // is this user a board moderator
      error: Boom.badRequest(),
      type: 'isMod',
      method: server.db.moderators.isModeratorWithThreadId,
      args: [userId, threadId],
      permission: server.plugins.acls.getACLValue(auth, 'threads.sticky.bypass.owner.mod')
    }
  ];

  var access = server.authorization.stitch(Boom.badRequest(), conditions, 'any');

  var notBannedFromBoard = server.authorization.common.isNotBannedFromBoard(Boom.forbidden('You are banned from this board'), server, userId, { threadId: threadId });

  return Promise.all([allowed, access, notBannedFromBoard]);
};
