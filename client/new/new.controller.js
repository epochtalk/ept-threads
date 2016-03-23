var controller = ['$anchorScroll', '$stateParams', '$location', 'Session', 'Threads', 'Alert', function($anchorScroll, $stateParams, $location, Session, Threads, Alert) {
    $anchorScroll();
    var ctrl = this;
    this.loggedIn = Session.isAuthenticated;
    this.exitEditor = false;
    this.dirtyEditor = false;
    this.resetEditor = true;
    this.pollValid = false;
    this.addPoll = false;
    this.poll = {};
    this.thread = {
      title: '',
      board_id: $stateParams.boardId,
      sticky: false,
      locked: false
    };
    this.poll = {
      question: '',
      answers: ['', '']
    };

    this.hasOptions = function() {
      if (this.canLock() || this.canSticky() || this.canModerate() || this.canCreatePoll()) {
        return true;
      }
      else { return false; }
    };

    this.canLock = function() {
      if (!ctrl.loggedIn()) { return false; }
      if (!Session.hasPermission('threads.lock.allow')) { return false; }
      return true;
    };

    this.canSticky = function() {
      if (!ctrl.loggedIn()) { return false; }
      if (!Session.hasPermission('threads.sticky.allow')) { return false; }
      return true;
    };

    this.canModerate = function() {
      if (!ctrl.loggedIn()) { return false; }
      if (!Session.hasPermission('threads.moderated.allow')) { return false; }
      return true;
    };

    this.canCreatePoll = function() {
      if (!ctrl.loggedIn()) { return false; }
      if (!Session.hasPermission('threads.createPoll.allow')) { return false; }
      return true;
    };

    this.addPollAnswer = function() { ctrl.poll.answers.push(''); };
    this.removePollAnswer = function(index) { ctrl.poll.answers.splice(index, 1); };

    this.save = function() {
      ctrl.exitEditor = true;

      // append poll to thread
      if (ctrl.addPoll && ctrl.pollValid) { ctrl.thread.poll = ctrl.poll; }

      // create a new thread and post
      Threads.save(ctrl.thread).$promise
      .then(function(thread) { $location.path('/threads/' + thread.thread_id + '/posts'); })
      .catch(function(err) {
        ctrl.exitEditor = false;
        var error = 'Could not create thread: ' + err.data.message;
        if (err.status === 429) { error = 'New Thread Rate Limit Exceeded'; }
        Alert.error(error);
      });
    };
  }
];

module.exports = angular.module('ept.newThread.ctrl', [])
.controller('NewThreadCtrl', controller)
.name;
