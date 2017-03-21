'use strict';

angular.module('4sh-workshops-pollApp')
  .service("WorkshopLogger", function(){
    var observerCallbacksByLogEvent = {
      log: [],
      info: [],
      warn: [],
      error: [],
      exception: [],
      userLogin: [],
      userLogoff: []
    };

    var CACHED_COMPILED_MESSAGE = {};
    var buildInterpolatedMessage = function(msg, msgParams) {
      if(!CACHED_COMPILED_MESSAGE[msg]) {
        CACHED_COMPILED_MESSAGE[msg] = Handlebars.compile(msg);
      }
      var compiledMsg = CACHED_COMPILED_MESSAGE[msg];
      return compiledMsg(msgParams);
    };

    var WorkshopLoggerClass = {
      log: function(message, msgParams) {
        var interpolatedMsg = buildInterpolatedMessage(message, msgParams);
        console.log(interpolatedMsg);
        WorkshopLoggerClass._triggerRegisteredObservers('log', {message: message, interpolatedMsg: interpolatedMsg});
      },
      info: function(message, msgParams) {
        var interpolatedMsg = buildInterpolatedMessage(message, msgParams);
        console.info(interpolatedMsg);
        WorkshopLoggerClass._triggerRegisteredObservers('info', {message: message, interpolatedMsg: interpolatedMsg});
      },
      warn: function(message, msgParams) {
        var interpolatedMsg = buildInterpolatedMessage(message, msgParams);
        console.warn(interpolatedMsg);
        WorkshopLoggerClass._triggerRegisteredObservers('warn', {message: message, interpolatedMsg: interpolatedMsg});
      },
      error: function(message, msgParams, skipLog, skipGA, skipReportPopup, isTrivial) {
        var interpolatedMsg = buildInterpolatedMessage(message, msgParams);
        if(!skipLog) {
          console.error(interpolatedMsg);
        }
        WorkshopLoggerClass._triggerRegisteredObservers('error', {message: message, interpolatedMsg: interpolatedMsg, isTrivial: isTrivial, skipGA: skipGA, skipReportPopup: skipReportPopup });
      },
      exception: function(exception, msgParams, skipLog, skipGA, skipReportPopup, additionnalMessage, isTrivial) {
        var message = exception.toString();
        var interpolatedMsg = buildInterpolatedMessage(message, msgParams);
        var stacktrace = window.printStackTrace({e: exception});
        if(stacktrace) {
          interpolatedMsg = "Exception : ["+interpolatedMsg+(additionnalMessage?", "+additionnalMessage:"")+"] with stacktrace : "+stacktrace;
        }
        if(!skipLog) {
          console.error(interpolatedMsg);
        }
        WorkshopLoggerClass._triggerRegisteredObservers('exception', {message: message, interpolatedMsg: interpolatedMsg, isTrivial: isTrivial, skipGA: skipGA, skipReportPopup: skipReportPopup });
      },
      defineCurrentUser: function(user, props) {
        if(user) {
          console.info("Changed current user to ["+user.userId()+"]");
          WorkshopLoggerClass._triggerRegisteredObservers('userLogin', {user: user, props: props});
        } else {
          console.info("Current user logged off !");
          WorkshopLoggerClass._triggerRegisteredObservers('userLogoff');
        }
      },

      registerLogLevelObserver: function(logEvent, callback) {
        observerCallbacksByLogEvent[logEvent].push(callback);
      },

      _triggerRegisteredObservers: function(logEvent, data) {
        _.each(observerCallbacksByLogEvent[logEvent], function(observer) {
          observer(data);
        });
      }
    };

    return WorkshopLoggerClass;
  });
