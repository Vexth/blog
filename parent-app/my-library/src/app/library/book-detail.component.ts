import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Book, BooksService } from './books.service';

@Component({
  selector: 'app-book-detail',
  template: `
    <h1>Book detail</h1>
    
    <ng-container *ngIf="book$ | async as book">
      <p>Author: <span>{{book.author.surname}}{{book.author.name}}</span></p>
      <p>Title: {{book.title}}</p>
      <p>Price:  {{book.price}}</p>
	</ng-container>
  `
})
export class BookDetailComponent {
	book$!: Observable<Book | undefined>;
	
  constructor(private booksService: BooksService, private route: ActivatedRoute) {
  	const bookId = route.snapshot.paramMap.get('bookId');
  	
  	if (bookId) {
  		this.book$ = this.booksService.getBookById(bookId);
  	}
  }
}