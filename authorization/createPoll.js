var Boom = require('boom');
var Promise = require('bluebird');

module.exports = function threadsCreatePoll(server, auth, threadId, poll) {
  var userId = auth.credentials.id;

  // check base permission
  var allowed = server.authorization.build({
    error: Boom.forbidden(),
    type: 'hasPermission',
    server: server,
    auth: auth,
    permission: 'threads.createPoll.allow'
  });

  // access board
  var access = server.authorization.build({
    error: Boom.notFound('Board Not Found'),
    type: 'dbValue',
    method: server.db.threads.getThreadsBoardInBoardMapping,
    args: [threadId, server.plugins.acls.getUserPriority(auth)]
  });

  // is requester active
  var active = server.authorization.build({
    error: Boom.forbidden('Account Not Active'),
    type: 'isActive',
    server: server,
    userId: userId
  });

  // Check that user isn't banned from this board
  var notBannedFromBoard = server.authorization.common.isNotBannedFromBoard(Boom.forbidden('You are banned from this board'), server, userId, { threadId: threadId });

  // can create poll / ownership
  var ownerCond = [
    {
      // Permission based override
      error: Boom.badRequest('not admin'),
      type: 'hasPermission',
      server: server,
      auth: auth,
      permission: 'threads.createPoll.bypass.owner.admin'
    },
    {
      // is board moderator
      error: Boom.badRequest('not mod'),
      type: 'isMod',
      method: server.db.moderators.isModeratorWithThreadId,
      args: [userId, threadId],
      permission: server.plugins.acls.getACLValue(auth, 'threads.createPoll.bypass.owner.mod')
    },
    new Promise(function(resolve) {
      var getPollExists = server.db.polls.exists(threadId);
      var getThreadOwner = server.db.threads.getThreadOwner(threadId);
      return resolve(Promise.join(getThreadOwner, getPollExists, function(owner, pollExists) {
        if (pollExists) { return Promise.reject(Boom.badRequest('Poll already exists')); }
        else if (owner.user_id === userId) { return true; }
        else { return Promise.reject(Boom.forbidden()); }
      }));
    })
  ];
  var owner = server.authorization.stitch(Boom.badRequest(), ownerCond, 'any');

  // poll based authorization
  var pollCond = [
    // validate poll max answers
    new Promise(function(resolve) {
      if (!poll) { return resolve(); }
      var maxAnswers = poll.max_answers;
      var answersLength = poll.answers.length;
      if (maxAnswers > answersLength) { poll.max_answers = answersLength; }
      return resolve(poll);
    }),
    // validate Display Mode
    new Promise(function(resolve, reject) {
      if (!poll) { return resolve(); }
      if (poll.display_mode === 'expired' && !poll.expiration) {
        return reject(Boom.badRequest('Showing results after expiration requires an expiration'));
      }
      else { return resolve(poll); }
    })
  ];
  var pollData = server.authorization.stitch(Boom.badRequest(), pollCond, 'all')
  .then(function() { return poll; });

  return Promise.all([allowed, access, notBannedFromBoard, active, owner, pollData]);
};
