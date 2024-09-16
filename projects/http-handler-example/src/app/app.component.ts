import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { handle, setDefaultErrorHandler, setDefaultRetryCount, setDefaultRetryDelay } from 'angular-http-handler';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  http = inject(HttpClient);

  loading = false;
  response: any = null;

  ngOnInit(): void {
    setDefaultErrorHandler((error: HttpErrorResponse) => {
      console.log('deafult handler', error)
    });
    setDefaultRetryCount(0);
    setDefaultRetryDelay(500);

    this.http.get<Post[]>(this.apiUrl).pipe(handle(
      (response) => {
        this.response = response;
        console.log(response)
      },
      (loading) => { // OPTIONAL - loader indicator
        this.loading = loading;
        console.log(loading)
      },
      [], // OPTIONAL - custom fallback value
      (e) => console.log(e, 'custom'), // OPTIONAL - custom error handler
      2, // OPTIONAL - retry count
      1000, // OTIONAL - retry delay
    )).subscribe();
  }
}
