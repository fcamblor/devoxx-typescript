'use strict';

angular.module('4sh-workshops-pollApp')
  .component('workshopListPage', {
    templateUrl: 'views/workshopList.html',
    bindings: {

    },
    controller: function() {
      var self = this;
      angular.extend(self, {
        awesomeThings: [
          'RESTX',
          'Twitter Bootstrap',
          'AngularJS',
          'Karma'
        ]
      });
    }
  });
