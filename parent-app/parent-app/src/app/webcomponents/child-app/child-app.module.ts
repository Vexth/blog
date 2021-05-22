import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LazyElementsModule } from '@angular-extensions/elements';

import { ChildAppComponent } from './child-app.component';

const routes: Routes = [
	{
		path: '**',
		component: ChildAppComponent,
	},
];

@NgModule({
	declarations: [ChildAppComponent],
	imports: [CommonModule, RouterModule.forChild(routes), LazyElementsModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	exports: [ChildAppComponent]
})
export class ChildAppModule { }
