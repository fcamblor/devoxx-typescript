

import {WorkshopLogger} from "../utils/WorkshopLogger";

class WorkshopListController {
  private polls: any[] = [];

  public static $inject = ['$http'];
  constructor($http){
    $http.get("/api/polls").then((polls) => {
      this.polls.length = 0;
      Array.prototype.push.apply(this.polls, polls.data);
    }, (error) => WorkshopLogger.error(error));
  }
}


export const WORKSHOP_LIST_PAGE = {
  template: `
<div class="mdl-grid">
  <div ng-repeat="poll in $ctrl.polls" class="mdl-cell mdl-cell--6-col mdl-cell--12-col-phone mdl-shadow--4dp">
    <div class="mdl-card__supporting-text">
      <h4>{{poll.name}}</h4>
      <button ui-sref="app.workshops-vote({ workshopId: poll._id })" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
        Vote for topics
      </button>
    </div>
  </div>
</div>
  `,
  bindings: {
    polls: '<'
  },
  controller: WorkshopListController
};

