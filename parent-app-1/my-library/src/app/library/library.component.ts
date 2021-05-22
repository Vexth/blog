import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Book, BooksService } from "./books.service";

@Component({
  selector: 'app-library',
  template: `
    <h1>Library</h1>
    <ol *ngIf="books$ | async as books">
      <li *ngFor="let book of books">
	      <a [routerLink]="'/library/' + book.id">{{book.title}}</a>
      </li>
    </ol>
  `
})
export class LibraryComponent implements OnInit {
  books$: Observable<Book[]>;

  constructor(private booksService: BooksService) {
    this.books$ = this.booksService.books$;
  }

  ngOnInit(): void {
  }

}
