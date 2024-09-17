import { HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, catchError, finalize, Observable, of, retry, tap } from "rxjs";

export interface IHandlerConfig {
  defaultRetryCount?: number;
  defaultRetryDelay?: number;
  defaultErrorHandler?: (error: HttpErrorResponse) => void;
} 

let defaultErrorHandler: ((error: HttpErrorResponse) => void) | undefined;
let defaultRetryCount = 0;
let defaultRetryDelay = 0;
export function configureHandler(config: IHandlerConfig) {
  defaultErrorHandler = config.defaultErrorHandler;
  defaultRetryCount = config.defaultRetryCount ?? 0;
  defaultRetryDelay = config.defaultRetryDelay ?? 0;
}


let requestCount = 0;
let requestsSubject = new BehaviorSubject<number>(0);
let requests$ = requestsSubject.asObservable();

export function pendingRequestsCount(): Observable<number> {
  return requests$;
}

export function handle<T>(
    dataSetter: (response: T) => void,
    loadingSetter?: (loading: boolean) => void,
    fallbackValue?: any,
    errorHandler?: (error: HttpErrorResponse) => void,
    retryCount: number = defaultRetryCount,
    retryDelay: number = defaultRetryDelay,
  ): (source$: Observable<T>) => Observable<T> {
    return (source$: Observable<T>) => {
      requestCount++;
      requestsSubject.next(requestCount);
      if(loadingSetter){
        loadingSetter(true);
      }
      return source$.pipe(

        retry({
          count: retryCount,
          delay: retryDelay,
          resetOnSuccess: true
        }),

        tap((data: T) => dataSetter(data)),

        catchError((error: HttpErrorResponse) => {
          if (errorHandler) {
            errorHandler(error);
          } else if (defaultErrorHandler) {
            defaultErrorHandler(error);
          }

          if(fallbackValue !== undefined){
            dataSetter(fallbackValue as T);
            return of(fallbackValue as T);
          }
          return of(null as T);
        }),

        finalize(() => {
          requestCount--;
          requestCount = requestCount < 0 ? 0 : requestCount;
          requestsSubject.next(requestCount);
          if(loadingSetter){
            loadingSetter(false);
          }
        })

      );
    }
}

