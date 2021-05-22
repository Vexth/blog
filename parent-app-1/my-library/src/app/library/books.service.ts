import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Book {
  id: string;
  title: string;
  excerpt: string;
  price: number;
  currency: 'EUR' | 'GBP' | 'USD' | 'CNY';
  author: {
    name: string;
    surname: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor() { }

  books$: BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>([
    {
      id: '1',
      title: 'Go 语言编程之旅：一起用Go做项目',
      price: 59.40,
      currency: 'CNY',
      excerpt: '一起用Go做项目',
      author: {
        name: '新华',
        surname: '徐',
      },
    },
    {
      id: '2',
      title: 'Go语言趣学指南',
      price: 53.00,
      currency: 'CNY',
      excerpt: '适合对初学Go语言有不同需求的程序员阅读',
      author: {
        name: '内森.扬曼',
        surname: '',
      },
    },
    {
      id: '3',
      title: 'Go专家编程',
      price: 59.40,
      currency: 'CNY',
      excerpt: '华为资深工程师力作',
      author: {
        name: '洪彩',
        surname: '任',
      },
    }
  ]);

  getBookById(bookId: string): Observable<Book | undefined> {
		return this.books$.pipe(
			map((books) => books.find((book) => book.id === bookId))
		);
	}
}
