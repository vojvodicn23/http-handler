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
        (loading) => {
          this.loading = loading;
          console.log(loading);
        },
        (response) => {
          this.response = response;
          console.log(response);
        },
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

## Fallback Response Behavior

The `handle` function guarantees that a fallback response will always be returned in case of an error, based on the type of the response (`T`). 

- **If the expected response is an array type (e.g., `string[]`, `any[]`)**, the fallback will be an empty array (`[]`).
- **If the expected response is any other type (e.g., `string`, `number`, `object`)**, the fallback will be `null`.

This ensures that the `dataSetter` will always receive a value of type `T` even in the case of an error, simplifying error handling and avoiding undefined values in your application.


## API

The handle function manages HTTP requests with loading state, error handling and retry.

Parameters:

- loadingSetter: (loading: boolean) => void
Function to set the loading state (e.g., this.loading = loading).

- dataSetter: (response: T) => void
Function to set the data when the request succeeds (e.g., this.data = response).

- errorHandler?: (error: HttpErrorResponse) => void
Optional function to handle errors (e.g., console.error(error)).

- retryCount?: number
Number of retries for failed requests. Defaults to 0.

- retryDelay?: number
Delay between retries in milliseconds.

- Returns
An Observable<T> that handles the request, error, retry.