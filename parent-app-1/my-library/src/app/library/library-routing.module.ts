import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LibraryComponent } from './library.component';
import { BookDetailComponent } from './book-detail.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: LibraryComponent },
  { path: ':bookId', component: BookDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibraryRoutingModule { }
