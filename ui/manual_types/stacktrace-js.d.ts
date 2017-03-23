
declare interface PrintStackTraceParams {
  e: Error|string
}

interface Window {
  printStackTrace(params: PrintStackTraceParams):string;
}
