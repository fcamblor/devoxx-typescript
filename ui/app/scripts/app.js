'use strict';

angular.module('4sh-workshops-pollApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router'
])
.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/workshops');

  $stateProvider
    .state({
      name: 'app',
      abstract: true,
      template: "<ui-view/>"
    })
    .state({
      name: 'app.workshops',
      url: '/workshops',
      component: 'workshopListPage'
    });
});
