import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { configureHandler, handle, pendingRequestsCount } from 'angular-http-handler';
import { delay, Subscription } from 'rxjs';

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
export class AppComponent implements OnInit, OnDestroy {

  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  http = inject(HttpClient);

  loading = false;
  response: any = null;

  subs = new Subscription;

  ngOnInit(): void {
    configureHandler({
      defaultErrorHandler: (error: HttpErrorResponse) => {
        console.log('deafult handler', error);
      },
      defaultRetryCount: 0,
      defaultRetryDelay: 0
    });
    this.subs.add(pendingRequestsCount().subscribe(count => {
      console.log('Pending request count: ', count);
    }));

    this.http.get<Post[]>(this.apiUrl).pipe(handle(
      (response) => {
        this.response = response;
        console.log(response);
      },
      (loading) => { // OPTIONAL - loader indicator
        console.log(loading)
      },
      [], // OPTIONAL - custom fallback value
      (e) => console.log(e, 'custom'), // OPTIONAL - custom error handler
      2, // OPTIONAL - retry count
      1000, // OTIONAL - retry delay
    )).subscribe();

    this.http.get<Post>(this.apiUrl + '/1').pipe(handle(
      (response) => {
        console.log(response)
      }
    )).subscribe();

    this.http.get<Post>(this.apiUrl).pipe(delay(3000),handle(
      (response) => {
        console.log(response)
      }
    )).subscribe();


    
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
