'use strict';

angular.module('4sh-workshops-pollApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router'
])
.run(['$rootScope', '$transitions', function($rootScope, $transitions) {
  $transitions.onSuccess({}, function(transition){
    $rootScope.pageTitle = transition.targetState()._definition.title || "TODO: PROVIDE TITLE IN STATE";
  });
}])
.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/workshops');

  $stateProvider
    .state({ name: 'app', abstract: true, template: "<ui-view/>" })
    .state({ name: 'app.workshops', url: '/workshops', component: 'workshopListPage', title: "Workshops" })
    .state({
      name: 'app.workshops-vote', url: '/workshops/{workshopId}/vote', component: 'workshopVotesPage', title: 'Vote for topics',
      resolve: {
        detailedPoll: function ($http, $stateParams) {
          return $http.get('api/polls/' + $stateParams.workshopId).then(function (detailedPoll) { return detailedPoll.data; });
        }
      }
    });
});
