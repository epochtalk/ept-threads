var Boom = require('boom');
var Promise = require('bluebird');

module.exports = function threadsEditPoll(server, auth, params, payload) {
  var poll = payload;
  var pollId = params.pollId;
  var threadId = params.threadId;
  var userId = auth.credentials.id;

  // check base permission
  var allowed = server.authorization.build({
    error: Boom.forbidden(),
    type: 'hasPermission',
    server: server,
    auth: auth,
    permission: 'threads.editPoll.allow'
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

  // Check if has poll exists
  var exists = server.db.polls.exists(threadId)
  .then(function(exists) {
    if (exists) { return true; }
    else { return Promise.reject(Boom.badRequest('Poll Does Not Exists')); }
  });

  // is poll owner
  var ownerCond = [
    {
      // permission based override
      type: 'hasPermission',
      server: server,
      auth: auth,
      permission: 'polls.editPoll.bypass.owner.admin'
    },
    {
      // is thread owner
      type: 'isThreadOwner',
      method: server.db.threads.getThreadOwner,
      args: [threadId],
      userId: userId
    },
    {
      // is board moderator
      type: 'isMod',
      method: server.db.moderators.isModeratorWithThreadId,
      args: [userId, threadId],
      permission: server.plugins.acls.getACLValue(auth, 'polls.editPoll.bypass.owner.mod')
    }
  ];
  var owner = server.authorization.stitch(Boom.forbidden(), ownerCond, 'any');

  // validate display mode
  var display = new Promise(function(resolve, reject) {
    if (!poll) { return resolve(); }
    if (poll.display_mode === 'expired' && !poll.expiration) {
      return reject(Boom.badRequest('Showing results after expiration requires an expiration'));
    }
    else { return resolve(poll); }
  });

  // validate max answers update // TODO: limit low end of maxAnswers?
  var answers = server.db.polls.answers(pollId)
  .then(function(pollAnswers) {
    var maxAnswers = payload.max_answers;
    var answersLength = pollAnswers.length;
    if (maxAnswers > answersLength) { payload.max_answers = answersLength; }
  });

  return Promise.all([allowed, access, notBannedFromBoard, active, exists, owner, display, answers]);
};
