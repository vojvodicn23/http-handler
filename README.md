# Angular HTTP Handler

## Introduction

An Angular library for handling HTTP requests with loading state management, error handling, retry logic, and fallback values.
Supported Angular versions: 15, 16, 17, 18.

## Features

- Automatically sets loading state during HTTP requests
- Handles errors with an optional error handler
- Supports retry logic for failed requests
- Provides a fallback value when the request fails
- Can return empty arrays or null based on the response type

## Installation

To install the library, run the following command:

```bash
npm install angular-http-handler
```

## Usage

In your Angular component, you can apply the handle function to any HTTP request.
Here's an example using HttpClient:
```typescript
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { handle } from 'angular-http-handler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private apiUrl = 'YOUR API URL';
  http = inject(HttpClient);

  loading = false;
  response: any[] = [];

  ngOnInit(): void {
    this.http.get<any[]>(this.apiUrl).pipe(
      handle(
        (response) => {
          this.response = response;
          console.log(response);
        },
        (loading) => { // OPTIONAL - loading indicator
          this.loading = loading;
          console.log(loading);
        },
        [], // OPTIONAL - custom fallback value
        (error) => { // OPTIONAL - custom error handler
            console.log(error);
        }, 
        2, // OPTIONAL - retry count
        1000, // OPTIONAL - retry delay
      )
    ).subscribe();
  }
}
```


## API

The `handle` function manages HTTP requests with loading state, error handling and retry.
Parameters:

- dataSetter: (response: T) => void
Function to set the data when the request succeeds (e.g., this.data = response).

- loadingSetter?: (loading: boolean) => void
Function to set the loading state (e.g., this.loading = loading).

- fallbackValue?: any
Value that will be returned in case of error.

- errorHandler?: (error: HttpErrorResponse) => void
Optional function to handle errors (e.g., console.error(error)).

- retryCount?: number
Number of retries for failed requests. Defaults to 0.

- retryDelay?: number
Delay between retries in milliseconds.

- Returns
An Observable<T> that handles the request, error, retry.


The `setDefaultErrorHandler` set default error handler for every handler request. In case custom error handler is passed as a parameter to handle function it will overwrite the default one.
Use it on root component on init method:
```typescript
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { setDefaultErrorHandler } from 'angular-http-handler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    setDefaultErrorHandler((error: HttpErrorResponse) => {
      console.log('deafult handler', error);
      customErrorHandlerFuction(error);
    });
  }
}
```


The `defaultRetryCount` and `setDefaultRetryDelay` set default number of retry in case of error and time between the calls. If you pass it as a parameter it will overwrite the default value.
Use it on root component on init method:
```typescript
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { setDefaultRetryCount, setDefaultRetryDelay } from 'angular-http-handler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    setDefaultRetryCount(2);
    setDefaultRetryDelay(500);
  }
}
```


## Fallback Response Behavior

The `handle` function returns a fallback response in case you define it as a 3rd parameter. In case you do not define it it will remain undefined and it will not trigger dataSetter function. 