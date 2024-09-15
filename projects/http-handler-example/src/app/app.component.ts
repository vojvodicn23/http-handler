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
          console.log(response)
        },
        (loading) => { // OPTIONAL - loader indicator
          this.loading = loading;
          console.log(loading)
        },
        (e) => console.log(e, 'custom'), // OPTIONAL - custom error handler
        2, // OPTIONAL - retry count
        1000, // OTIONAL - retry delay
      )
    ).subscribe();
  }
}
