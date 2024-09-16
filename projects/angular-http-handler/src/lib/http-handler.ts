import { HttpErrorResponse } from "@angular/common/http";
import { catchError, finalize, Observable, of, retry, tap } from "rxjs";

let defaultErrorHandler: ((error: HttpErrorResponse) => void) | undefined;
export function setDefaultErrorHandler(handler: (error: HttpErrorResponse) => void) {
  defaultErrorHandler = handler;
}

let defaultRetryCount: number = 0;
export function setDefaultRetryCount(count: number) {
  defaultRetryCount = count;
}

let defaultRetryDelay: number = 0;
export function setDefaultRetryDelay(delay: number) {
  defaultRetryDelay = delay;
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

        catchError((error: HttpErrorResponse, caught: Observable<T>) => {
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
          if(loadingSetter){
            loadingSetter(false);
          }
        })

      );
    }
}

