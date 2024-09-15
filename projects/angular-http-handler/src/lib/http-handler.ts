import { HttpErrorResponse } from "@angular/common/http";
import { catchError, finalize, Observable, of, retry, tap } from "rxjs";

export function handle<T>(
    loadingSetter: (loading: boolean) => void,
    dataSetter: (response: T) => void,
    errorHandler?: (error: HttpErrorResponse) => void,
    retryCount: number = 0,
    retryDelay?: number,
    fallbackValue?: T | (() => T),
  ): (source$: Observable<T>) => Observable<T> {
    return (source$: Observable<T>) =>
      source$.pipe(
        tap(() => loadingSetter(true)),
        retry({
          count: retryCount,
          delay: retryDelay,
          resetOnSuccess: true
        }),
        tap((data: T) => dataSetter(data)),
        catchError((error) => {
/*             const errorMsg = error.error instanceof ErrorEvent 
            ? `Error: ${error.error.message}` // Client-side error
            : `Error Code: ${error.status}, Message: ${error.message}`; // Server-side error
            console.error(errorMsg); */
        
            // Call the provided error handler if it exists
            if (errorHandler) {
                errorHandler(error);
            }

            let fallback: T;
            if (typeof fallbackValue === 'function') {
              fallback = (fallbackValue as () => T)();
            } else if (fallbackValue !== undefined) {
              fallback = fallbackValue;
            } else {
              fallback = (Array.isArray([] as unknown as T) ? [] : null) as T;
            }
            
            dataSetter(fallback);
            return of(fallback);
        }),
        finalize(() => loadingSetter(false))
    );
  }