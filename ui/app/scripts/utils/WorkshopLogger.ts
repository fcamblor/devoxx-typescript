
// declare var angular: any;

type LogEvent = "log"|"info"|"warn"|"error"|"exception"|"userLogin"|"userLogoff";

var observerCallbacksByLogEvent: ObserverCallbacksByLogEvent = {
  log: [],
  info: [],
  warn: [],
  error: [],
  exception: [],
  userLogin: [],
  userLogoff: []
};

type Foo = WorkshopLogger;
type ObserverCallbacksByLogEvent = { [logEvent in LogEvent]: LogCallback[] };
type LogCallback = (data?: LogContext) => void;
type LogContext = LogUserContext | LogStdContext;
interface LogUserContext {
  user: any;
  props: any;
}
interface LogStdContext {
  message: string;
  interpolatedMsg: string;
  isTrivial?: boolean;
  skipGA?: boolean;
  skipReportPopup?: boolean;
}

var CACHED_COMPILED_MESSAGE = {};
var buildInterpolatedMessage = function(msg, msgParams) {
  if(!CACHED_COMPILED_MESSAGE[msg]) {
    CACHED_COMPILED_MESSAGE[msg] = Handlebars.compile(msg);
  }
  var compiledMsg = CACHED_COMPILED_MESSAGE[msg];
  return compiledMsg(msgParams);
};

export class WorkshopLogger {
  public static log(message, msgParams) {
    var interpolatedMsg = buildInterpolatedMessage(message, msgParams);
    console.log(interpolatedMsg);
    WorkshopLogger._triggerRegisteredObservers('log', {message: message, interpolatedMsg: interpolatedMsg});
  }

  public static info(message, msgParams) {
    var interpolatedMsg = buildInterpolatedMessage(message, msgParams);
    console.info(interpolatedMsg);
    WorkshopLogger._triggerRegisteredObservers('info', {message: message, interpolatedMsg: interpolatedMsg});
  }

  public static warn(message, msgParams) {
    var interpolatedMsg = buildInterpolatedMessage(message, msgParams);
    console.warn(interpolatedMsg);
    WorkshopLogger._triggerRegisteredObservers('warn', {message: message, interpolatedMsg: interpolatedMsg});
  }

  public static error(message, msgParams, skipLog, skipGA, skipReportPopup, isTrivial) {
    var interpolatedMsg = buildInterpolatedMessage(message, msgParams);
    if(!skipLog) {
      console.error(interpolatedMsg);
    }
    WorkshopLogger._triggerRegisteredObservers('error', {message: message, interpolatedMsg: interpolatedMsg, isTrivial: isTrivial, skipGA: skipGA, skipReportPopup: skipReportPopup });
  }

  public static exception(exception, msgParams, skipLog, skipGA, skipReportPopup, additionnalMessage, isTrivial) {
    var message = exception.toString();
    var interpolatedMsg = buildInterpolatedMessage(message, msgParams);
    var stacktrace = window.printStackTrace({e: exception});
    if(stacktrace) {
      interpolatedMsg = "Exception : ["+interpolatedMsg+(additionnalMessage?", "+additionnalMessage:"")+"] with stacktrace : "+stacktrace;
    }
    if(!skipLog) {
      console.error(interpolatedMsg);
    }
    WorkshopLogger._triggerRegisteredObservers('exception', {message: message, interpolatedMsg: interpolatedMsg, isTrivial: isTrivial, skipGA: skipGA, skipReportPopup: skipReportPopup });
  }

  public static defineCurrentUser(user, props) {
    if(user) {
      console.info("Changed current user to ["+user.userId()+"]");
      WorkshopLogger._triggerRegisteredObservers('userLogin', {user: user, props: props});
    } else {
      console.info("Current user logged off !");
      WorkshopLogger._triggerRegisteredObservers('userLogoff');
    }
  }

  public static registerLogLevelObserver(logEvent: LogEvent, callback: LogCallback) {
    observerCallbacksByLogEvent[logEvent].push(callback);
  }

  public static _triggerRegisteredObservers(logEvent: LogEvent, data?: LogContext) {
    _.each(observerCallbacksByLogEvent[logEvent], function(observer: LogCallback) {
      observer(data);
    });
  }
}
