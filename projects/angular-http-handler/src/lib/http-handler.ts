import { HttpErrorResponse } from "@angular/common/http";
import { catchError, finalize, Observable, of, retry, tap } from "rxjs";

export function handle<T>(
    dataSetter: (response: T) => void,
    loadingSetter?: (loading: boolean) => void,
    errorHandler?: (error: HttpErrorResponse) => void,
    retryCount: number = 0,
    retryDelay?: number,
  ): (source$: Observable<T>) => Observable<T> {
    return (source$: Observable<T>) =>
      source$.pipe(
        tap(() => {
          if(loadingSetter){
            loadingSetter(true);
          }
        }),
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

            const fallback = (Array.isArray([] as unknown as T) ? [] : null) as T;
            
            dataSetter(fallback);
            return of(fallback);
        }),
        finalize(() => {
          if(loadingSetter){
            loadingSetter(false);
          }
        })
    );
  }