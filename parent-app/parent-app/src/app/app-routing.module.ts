import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'library-app',
    loadChildren: () => import('./webcomponents/library-app/library-app.module').then(m => m.LibraryAppModule),
  },
  {
    path: 'child-app',
    loadChildren: () => import('./webcomponents/child-app/child-app.module').then(m => m.ChildAppModule),
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
