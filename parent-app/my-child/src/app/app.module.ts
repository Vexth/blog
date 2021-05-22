// app.module.ts
import {ApplicationRef, DoBootstrap, Injector, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {createCustomElement} from '@angular/elements';

// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SampleModule } from './sample/sample.module';
import { SampleComponent } from './sample/sample.component';

const local = true;

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SampleModule
  ],
  providers: [],
  entryComponents: [SampleComponent],
  bootstrap: [local ? AppComponent : []]
})
export class AppModule implements DoBootstrap{
  constructor(private injector: Injector) {
    const child = createCustomElement(SampleComponent, {injector: this.injector})
    customElements.define('micro-child', child);
  }

  ngDoBootstrap(appRef: ApplicationRef): void {}
}
