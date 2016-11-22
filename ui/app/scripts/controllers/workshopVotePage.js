'use strict';

angular.module('4sh-workshops-pollApp')
  .component('workshopVotesPage', {
    templateUrl: 'views/workshopVote.html',
    bindings: {
      detailedPoll: '<'
    },
    controller: ['$http', '$stateParams', '$state', function($http, $stateParams, $state) {
      var self = this;
      console.log($stateParams.workshopId);
      angular.extend(self, {
        voterName: "",
        votesPerTopic: _.reduce(self.detailedPoll.topics, function(result, topic) {
          result[topic.title] = 0;
          return result;
        }, {}),

        remainingVotePoints: function(){
          return 10 - _.reduce(self.votesPerTopic, function(result, score, topic) {
            return result + Number(score);
          }, 0);
        },

        isValid: function(){
          return self.remainingVotePoints()>=0 && self.voterName && self.voterName.length >= 3;
        },

        submitPoints: function(){
          return $http.post("/api/polls/"+$stateParams.workshopId+"/votes", {
            name: self.voterName,
            pollId: $stateParams.workshopId,
            votes: _.map(self.votesPerTopic, function(score, topicTitle){
              return { topicTitle: topicTitle, points: score };
            })
          }).then(function(){
            alertify.success("Vote saved !");
            $state.go("app.workshops");
          }, function(result) {
            return alertify.error(result.data);
          });
        }
      });
    }]
  });
