import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { handle } from 'angular-http-handler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  http = inject(HttpClient);

  loading = false;

  ngOnInit(): void {
    this.http.get<any[]>(this.apiUrl).pipe(
      handle(
        (loading) => {
          this.loading = loading;
          console.log(loading)
        },
        (reports) => {
          console.log(reports)
        },
        (e) => console.log(e, 'custom'),
      )
    ).subscribe();

  }
}
