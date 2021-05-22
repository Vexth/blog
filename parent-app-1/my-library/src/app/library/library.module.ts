import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryComponent } from './library.component';
import { BookDetailComponent } from './book-detail.component';

import { BooksService } from './books.service';
import { LibraryRoutingModule } from "./library-routing.module";

@NgModule({
  declarations: [
    LibraryComponent,
    BookDetailComponent
  ],
  imports: [
    CommonModule,
    LibraryRoutingModule
  ],
  providers: [BooksService]
})
export class LibraryModule { }
