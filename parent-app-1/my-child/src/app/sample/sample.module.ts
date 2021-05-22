// sample.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleComponent } from './sample.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SampleComponent],
  exports: [
    SampleComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class SampleModule { }
