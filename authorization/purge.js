var Boom = require('boom');
var Promise = require('bluebird');

module.exports = function threadsPurge(server, auth, threadId) {
  var userId = auth.credentials.id;

  // check base permission
  var allowed = server.authorization.build({
    error: Boom.forbidden(),
    type: 'hasPermission',
    server: server,
    auth: auth,
    permission: 'threads.purge.allow'
  });

  // purge level
  var conditions = [
    {
      // permission based override
      type: 'hasPermission',
      server: server,
      auth: auth,
      permission: 'threads.purge.bypass.owner.admin'
    },
    {
      // is this user a board moderator
      error: Boom.badRequest(),
      type: 'isMod',
      method: server.db.moderators.isModeratorWithThreadId,
      args: [userId, threadId],
      permission: server.plugins.acls.getACLValue(auth, 'threads.purge.bypass.owner.mod')
    }
  ];
  var purgeLevel = server.authorization.stitch(Boom.badRequest(), conditions, 'any');

  var notBannedFromBoard = server.authorization.common.isNotBannedFromBoard(Boom.forbidden('You are banned from this board'), server, userId, { threadId: threadId });

  return Promise.all([allowed, purgeLevel, notBannedFromBoard]);
};
