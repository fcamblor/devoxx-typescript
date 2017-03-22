import {APP_VERSION} from "./utils/Version";
import * as angular from "angular";
import {WORKSHOP_LIST_PAGE} from "./controllers/workshopListPage";
import {WORKSHOP_VOTES_PAGE} from "./controllers/workshopVotePage";
import {WORKSHOP_VOTE_RESULTS_PAGE} from "./controllers/workshopVoteResultsPage";
import {WorkshopLogger} from "./utils/WorkshopLogger";
declare var componentHandler: any;

angular.module('4sh-workshops-pollApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'ui.router'
])
.run(['$rootScope', '$transitions', function($rootScope, $transitions) {
  $transitions.onSuccess({}, function(transition){
    $rootScope.pageTitle = transition.targetState()._definition.title || "TODO: PROVIDE TITLE IN STATE";

    // That's crappy, but material design lite needs upgradeDom() call to apply mdl styles / behaviour on the DOM on every
    // DOM change.
    // We handle here only cases where we want to apply MDL on new view content
    // Note that it won't work if we update the DOM without changing state
    setTimeout(function(){ componentHandler.upgradeDom(); }, 300);
  });

  console.log("App version "+APP_VERSION+" configured !");
}])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/workshops');

  $stateProvider
    .state({ name: 'app', abstract: true, template: "<ui-view/>" })
    .state({ name: 'app.workshops', url: '/workshops', component: 'workshopListPage', title: "Workshops" })
    .state({
      name: 'app.workshops-vote', url: '/workshops/{workshopId}/vote', component: 'workshopVotesPage', title: 'Vote for topics',
      resolve: {
        detailedPoll: ['$http', '$stateParams', function ($http, $stateParams) {
          return $http.get('api/polls/' + $stateParams.workshopId).then(function (detailedPoll) { return detailedPoll.data; });
        }]
      }
    })
    .state({
      name: 'app.workshops-vote-results', url: '/workshops/{workshopId}/voteResults', component: 'workshopVoteResultsPage', title: 'Workshop vote results',
      resolve: {
        pollVotes: ['$http', '$stateParams', function ($http, $stateParams) {
          return $http.get('api/polls/' + $stateParams.workshopId+"/votes").then(function (pollVotes) { return pollVotes.data; });
        }]
      }
    });
}])
.component('workshopListPage', WORKSHOP_LIST_PAGE)
.component('workshopVotesPage', WORKSHOP_VOTES_PAGE)
.component('workshopVoteResultsPage', WORKSHOP_VOTE_RESULTS_PAGE)
.constant("APP_VERSION", APP_VERSION)
.service("WorkshopLogger", WorkshopLogger);

angular.bootstrap(document, ['4sh-workshops-pollApp']);
