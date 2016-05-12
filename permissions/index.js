var Joi = require('joi');

var validation =  Joi.object().keys({
  create: Joi.object().keys({
    allow: Joi.boolean()
  }),
  moderated: Joi.object().keys({
    allow: Joi.boolean(),
  }),
  byBoard: Joi.object().keys({
    allow: Joi.boolean()
  }),
  posted: Joi.object().keys({
    allow: Joi.boolean()
  }),
  viewed: Joi.object().keys({
    allow: Joi.boolean()
  }),
  title: Joi.object().keys({
    allow: Joi.boolean(),
    bypass: Joi.object().keys({
      owner: Joi.object().keys({
        admin: Joi.boolean(),
        mod: Joi.boolean()
      }).xor('admin', 'mod')
    })
  }),
  lock: Joi.object().keys({
    allow: Joi.boolean(),
    bypass: Joi.object().keys({
      owner: Joi.object().keys({
        admin: Joi.boolean(),
        mod: Joi.boolean()
      }).xor('admin', 'mod')
    })
  }),
  sticky: Joi.object().keys({
    allow: Joi.boolean(),
    bypass: Joi.object().keys({
      owner: Joi.object().keys({
        admin: Joi.boolean(),
        mod: Joi.boolean()
      }).xor('admin', 'mod')
    })
  }),
  move: Joi.object().keys({
    allow: Joi.boolean(),
    bypass: Joi.object().keys({
      owner: Joi.object().keys({
        admin: Joi.boolean(),
        mod: Joi.boolean()
      }).xor('admin', 'mod')
    })
  }),
  purge: Joi.object().keys({
    allow: Joi.boolean(),
    bypass: Joi.object().keys({
      owner: Joi.object().keys({
        admin: Joi.boolean(),
        mod: Joi.boolean()
      }).xor('admin', 'mod')
    })
  }),
  vote: Joi.object().keys({
    allow: Joi.boolean()
  }),
  removeVote: Joi.object().keys({
    allow: Joi.boolean()
  }),
  createPoll: Joi.object().keys({
    allow: Joi.boolean(),
    bypass: Joi.object().keys({
      owner: Joi.object().keys({
        admin: Joi.boolean(),
        mod: Joi.boolean()
      }).xor('admin', 'mod')
    })
  }),
  editPoll: Joi.object().keys({
    allow: Joi.boolean(),
    bypass: Joi.object().keys({
      owner: Joi.object().keys({
        admin: Joi.boolean(),
        mod: Joi.boolean()
      }).xor('admin', 'mod')
    })
  }),
  lockPoll: Joi.object().keys({
    allow: Joi.boolean(),
    bypass: Joi.object().keys({
      owner: Joi.object().keys({
        admin: Joi.boolean(),
        mod: Joi.boolean()
      }).xor('admin', 'mod')
    })
  })
});

var superAdministrator = {
  create: { allow: true },
  moderated: { allow: true },
  byBoard: { allow: true },
  posted: { allow: true },
  viewed: { allow: true },
  title: {
    allow: true,
    bypass: { owner: { admin: true } }
  },
  lock: {
    allow: true,
    bypass: { owner: { admin: true } }
  },
  sticky: {
    allow: true,
    bypass: { owner: { admin: true } }
  },
  move: {
    allow: true,
    bypass: { owner: { admin: true } }
  },
  purge: {
    allow: true,
    bypass: { owner: { admin: true } }
  },
  vote: { allow: true },
  removeVote: { allow: true },
  createPoll: {
    allow: true,
    bypass: { owner: { admin: true } }
  },
  editPoll: {
    allow: true,
    bypass: { owner: { admin: true } }
  },
  lockPoll: {
    allow: true,
    bypass: { owner: { admin: true } }
  }
};

var administrator = {
  create: { allow: true },
  moderated: { allow: true },
  byBoard: { allow: true },
  posted: { allow: true },
  viewed: { allow: true },
  title: {
    allow: true,
    bypass: { owner: { admin: true } }
  },
  lock: {
    allow: true,
    bypass: { owner: { admin: true } }
  },
  sticky: {
    allow: true,
    bypass: { owner: { admin: true } }
  },
  move: {
    allow: true,
    bypass: { owner: { admin: true } }
  },
  purge: {
    allow: true,
    bypass: { owner: { admin: true } }
  },
  vote: { allow: true },
  removeVote: { allow: true },
  createPoll: {
    allow: true,
    bypass: { owner: { admin: true } }
  },
  editPoll: {
    allow: true,
    bypass: { owner: { admin: true } }
  },
  lockPoll: {
    allow: true,
    bypass: { owner: { admin: true } }
  }
};

var globalModerator = {
  create: { allow: true },
  moderated: { allow: true },
  byBoard: { allow: true },
  posted: { allow: true },
  viewed: { allow: true },
  title: {
    allow: true,
    bypass: { owner: { admin: true } }
  },
  lock: {
    allow: true,
    bypass: { owner: { admin: true } }
  },
  sticky: {
    allow: true,
    bypass: { owner: { admin: true } }
  },
  move: {
    allow: true,
    bypass: { owner: { admin: true } }
  },
  purge: {
    allow: true,
    bypass: { owner: { admin: true } }
  },
  vote: { allow: true },
  removeVote: { allow: true },
  createPoll: {
    allow: true,
    bypass: { owner: { admin: true } }
  },
  editPoll: {
    allow: true,
    bypass: { owner: { admin: true } }
  },
  lockPoll: {
    allow: true,
    bypass: { owner: { admin: true } }
  }
};

var moderator = {
  create: { allow: true },
  moderated: { allow: true },
  byBoard: { allow: true },
  posted: { allow: true },
  viewed: { allow: true },
  title: {
    allow: true,
    bypass: { owner: { mod: true } }
  },
  lock: {
    allow: true,
    bypass: { owner: { mod: true } }
  },
  sticky: {
    allow: true,
    bypass: { owner: { mod: true } }
  },
  move: {
    allow: true,
    bypass: { owner: { mod: true } }
  },
  purge: {
    allow: true,
    bypass: { owner: { mod: true } }
  },
  vote: { allow: true },
  removeVote: { allow: true },
  createPoll: {
    allow: true,
    bypass: { owner: { mod: true } }
  },
  editPoll: {
    allow: true,
    bypass: { owner: { mod: true } }
  },
  lockPoll: {
    allow: true,
    bypass: { owner: { mod: true } }
  }
};

var patroller = {
  create: { allow: true },
  moderated: { allow: true },
  byBoard: { allow: true },
  posted: { allow: true },
  viewed: { allow: true },
  title: { allow: true },
  lock: { allow: true },
  vote: { allow: true },
  removeVote: { allow: true },
  createPoll: { allow: true },
  editPoll: { allow: true },
  lockPoll: { allow: true }
};

var user = {
  create: { allow: true },
  moderated: { allow: true },
  byBoard: { allow: true },
  posted: { allow: true },
  viewed: { allow: true },
  title: { allow: true },
  lock: { allow: true },
  vote: { allow: true },
  removeVote: { allow: true },
  createPoll: { allow: true },
  editPoll: { allow: true },
  lockPoll: { allow: true }
};

var newbie = {
  create: { allow: true },
  moderated: { allow: true },
  byBoard: { allow: true },
  posted: { allow: true },
  viewed: { allow: true },
  title: { allow: true },
  lock: { allow: true },
  vote: { allow: true },
  removeVote: { allow: true },
  createPoll: { allow: true },
  editPoll: { allow: true },
  lockPoll: { allow: true }
};

var banned = {
  byBoard: { allow: true },
  posted: { allow: true },
  viewed: { allow: true }
};

var anonymous = {
  byBoard: { allow: true },
  viewed: { allow: true }
};

var layout = {
  create: { title: 'Create Threads' },
  moderated: { title: 'Self Moderate Threads' },
  byBoard: { title: 'View Board\'s Threads' },
  posted: { title: 'View Recent Threads the User Has Posted In' },
  viewed: { title: 'Track User Views on Threads' },
  title: {
    title: 'Edit Thread Titles',
    bypasses: [ { description: 'Ignore Thread Ownership', control: 'owner' } ]
  },
  lock: {
    title: 'Lock Threads',
    bypasses: [ { description: 'Ignore Thread Ownership', control: 'owner' } ]
  },
  sticky: {
    title: 'Sticky Threads (sticky level required)',
    bypasses: [ { description: 'Sticky Level', control: 'owner' } ]
  },
  move: {
    title: 'Move Threads (move level required)',
    bypasses: [ { description: 'Move Level', control: 'owner' } ]
  },
  purge: {
    title: 'Purge Threads (purge level required)',
    bypasses: [ { description: 'Purge Level', control: 'owner' } ]
  },
  vote: { title: 'Vote in Thread Polls' },
  removeVote: { title: 'Remove Vote in Thread Polls' },
  createPoll: {
    title: 'Create Poll in Threads',
    bypasses: [ { description: 'Ignore Thread Ownership', control: 'owner' } ]
  },
  editPoll: {
    title: 'Edit Poll in Threads',
    bypasses: [ { description: 'Ignore Thread Ownership', control: 'owner' } ]
  },
  lockPoll: {
    title: 'Lock Poll in Threads',
    bypasses: [ { description: 'Ignore Thread Ownership', control: 'owner' } ]
  }
};

module.exports = {
  validation: validation,
  layout: layout,
  defaults: {
    superAdministrator: superAdministrator,
    administrator: administrator,
    globalModerator: globalModerator,
    moderator: moderator,
    patroller: patroller,
    user: user,
    newbie: newbie,
    banned: banned,
    anonymous: anonymous,
    private: {}
  }
};
