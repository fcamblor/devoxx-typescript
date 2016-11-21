'use strict';

angular.module('4sh-workshops-pollApp')
  .component('workshopListPage', {
    templateUrl: 'views/workshopList.html',
    bindings: {
      polls: '<'
    },
    controller: function($http, $rootScope) {
      var self = this;

      angular.extend(self, {
        polls: []
      });

      $http.get("/api/polls").then(function(polls) {
        self.polls.length = 0;
        Array.prototype.push.apply(self.polls, polls.data);
      });
    }
  });
