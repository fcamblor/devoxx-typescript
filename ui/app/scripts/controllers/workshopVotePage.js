'use strict';

angular.module('4sh-workshops-pollApp')
  .component('workshopVotesPage', {
    templateUrl: 'views/workshopVote.html',
    bindings: {
      detailedPoll: '<'
    },
    controller: ['$http', '$stateParams', '$state', 'WorkshopLogger', function($http, $stateParams, $state, WorkshopLogger) {
      var self = this;

      WorkshopLogger.log("Current workshop id : {{workshopId}}", {workshopId:$stateParams.workshopId});

      _.each(self.detailedPoll.topics, function(topic) { topic.score = 0; });

      angular.extend(self, {
        voterName: "",

        remainingVotePoints: function(){
          return 10 - _.reduce(self.detailedPoll.topics, function(result, topic) {
            return result + Number(topic.score);
          }, 0);
        },

        isValid: function(){
          return self.remainingVotePoints()>=0 && self.voterName && self.voterName.length >= 3;
        },

        submitPoints: function(){
          return $http.post("/api/polls/"+$stateParams.workshopId+"/votes", {
            name: self.voterName,
            pollId: $stateParams.workshopId,
            votes: _.map(self.detailedPoll.topics, function(topic){
              return { topicTitle: topic.title, points: topic.score };
            })
          }).then(function(){
            alertify.success("Vote saved !");
            $state.go("app.workshops-vote-results", { workshopId: $stateParams.workshopId });
          }, function(result) {
            WorkshopLogger.error(result.data);
            return alertify.error(result.data);
          });
        }
      });
    }]
  });
