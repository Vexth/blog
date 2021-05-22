import { NgModule, DoBootstrap, Injector, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LibraryModule } from './library/library.module';

const localDevelopment = true;

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LibraryModule
  ],
  providers: [],
  bootstrap: [localDevelopment ? AppComponent : []]
})
export class AppModule implements DoBootstrap {
  
  constructor(private injector: Injector) {
    const libraryApp = createCustomElement(AppComponent, {injector: this.injector});

    customElements.define('micro-library', libraryApp);
  }

  ngDoBootstrap(appRef: ApplicationRef): void {}
}
