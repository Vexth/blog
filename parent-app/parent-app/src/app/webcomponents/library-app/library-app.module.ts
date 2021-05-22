import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LazyElementsModule } from '@angular-extensions/elements';

import { LibraryAppComponent } from './library-app.component';

const routes: Routes = [
	{
		path: '**',
		component: LibraryAppComponent,
	},
];

@NgModule({
	declarations: [LibraryAppComponent],
	imports: [RouterModule.forChild(routes), LazyElementsModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LibraryAppModule { }