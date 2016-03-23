var Joi = require('joi');
var Promise = require('bluebird');

/**
  * @apiVersion 0.4.0
  * @apiGroup Threads
  * @api {GET} /threads Page By Board
  * @apiName PageThreadsByBoard
  * @apiDescription Used to page through a board's threads.
  *
  * @apiParam (Query) {string} board_id The board whose threads to page through
  * @apiParam (Query) {number} page=1 The page of threads to bring back
  * @apiParam (Query) {number} limit=25 The number of threads to bring back per page
  *
  * @apiSuccess {array} threads An array containing threads for the requested board, page and limit
  *
  * @apiError (Error 500) InternalServerError There was an issue retrieving the threads
  */
module.exports = {
  method: 'GET',
  path: '/api/threads',
  config: {
    auth: { mode: 'try', strategy: 'jwt' },
    validate: {
      query: {
        board_id: Joi.string().required(),
        page: Joi.number().default(1),
        limit: Joi.number().integer().min(1).max(100).default(25)
      }
    },
    pre: [ { method: 'auth.threads.byBoard(server, auth, query.board_id)' } ]
  },
  handler: function(request, reply) {
    var userId;
    if (request.auth.isAuthenticated) { userId = request.auth.credentials.id; }
    var boardId = request.query.board_id;
    var opts = {
      limit: request.query.limit,
      page: request.query.page
    };

    var getThreads = request.db.threads.byBoard(boardId, userId, opts);
    var getBoard = request.db.boards.find(boardId);
    var getBoardWatching = request.db.boards.watching(boardId, userId);
    var getUserBoardBan = request.db.bans.isNotBannedFromBoard(userId, { boardId: boardId })
    .then((notBanned) => { return !notBanned || undefined; });

    var promise = Promise.join(getThreads, getBoard, getBoardWatching, getUserBoardBan, function(threads, board, boardWatching, bannedFromBoard) {
      // check if board is being Watched
      if (boardWatching) { board.watched = true; }

      return {
        board: board,
        bannedFromBoard: bannedFromBoard,
        page: request.query.page,
        limit: request.query.limit, // limit can be modified by query
        normal: threads.normal,
        sticky: threads.sticky
      };
    });

    return reply(promise);
  }
};
