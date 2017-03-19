'use strict';

angular.module('4sh-workshops-pollApp')
  .component('workshopVoteResultsPage', {
    templateUrl: 'views/workshopVoteResults.html',
    bindings: {
      pollVotes: '<'
    },
    controller: ['$http', '$stateParams', 'WorkshopLogger', function($http, $stateParams, WorkshopLogger) {
      var self = this;

      WorkshopLogger.log("Current workshop id : {{workshopId}}", {workshopId:$stateParams.workshopId});

      angular.extend(self, {
        votes: _.map(_.reduce(self.pollVotes, function(result, pollVote) {
          _.each(pollVote.votes, function(vote) {
            if(vote.points) {
              result[vote.topicTitle] = result[vote.topicTitle] || {
                  voters: [],
                  total: 0
              };

              result[vote.topicTitle].voters.push({ name: pollVote.name, score: vote.points });
              result[vote.topicTitle].total += Number(vote.points);
            }
          });
          return result;
        }, {}), function(vote, title){
          return _.extend(vote, {title: title});
        })
      });
    }]
  });
