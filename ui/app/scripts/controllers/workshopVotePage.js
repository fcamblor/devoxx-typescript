'use strict';

angular.module('4sh-workshops-pollApp')
  .component('workshopVotesPage', {
    templateUrl: 'views/workshopVote.html',
    bindings: {
      detailedPoll: '<'
    },
    controller: function($http, $stateParams) {
      var self = this;
      console.log($stateParams.workshopId);
      angular.extend(self, {
      });
    }
  });
