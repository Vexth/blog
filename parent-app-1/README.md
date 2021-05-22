### 0: 安装 `lite-server`
- 全局安装 `lite-server` 
- `npm install -g lite-server`

### 1: 创建微前端应用

- 1. 创建第一个新的应用 `ng n my-child`
- 2. 创建 `sample` 组件

      `ng g m sample`

      `ng g c sample --inlineStyle true --inlineTemplate true`

      ```js
      // sample.component.ts
      import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
      
      @Component({
        selector: 'app-sample',
        template: `
        <div style="border: blue solid 1px">
          <p>Data from Parent: {{dataFromParent}}</p>
          <input [(ngModel)]="input" [value]="input" (keydown.enter)="send()">
        </div>
        `,
        styles: []
      })
      export class SampleComponent implements OnChanges, OnInit {
        @Input() dataFromParent: string = "";
        @Output() emitDataToParent = new EventEmitter<string>();
        input: string = "";
        ifLoaded = false;
        constructor() { }
      
        send() {
          this.emitDataToParent.emit(this.input);
          this.input = '';
        }
      
        ngOnInit(): void {
          if (this.ifLoaded) {
            console.log(this.dataFromParent);
          }
        }
      
        ngOnChanges(changes: SimpleChanges): void {
          if (!this.ifLoaded) {
            this.ifLoaded = true;
            this.ngOnInit();
          }
        }
      }
      ```

      ```js
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
      
      ```

      ```html
      <!--app.component.html-->
      <app-sample></app-sample>
      ```
- 3. 安装 `@angular/elements`

      `ng add @angular/elements`
      修改 `app.module.ts` 通过 `createCustomElement` 创建微应用
      ```js
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
      
      ```
     第一个微应用创建完成，安装`ng add ngx-build-plus`，在根目录新增`bs-config.js`
      ```js
      "use strict";
      module.exports = {
          "port": 8084,
          "browser" : ["chrome"]
      }
      
      ```
      在`package.json`中增加
      ```js
      "build:prod": "ng build --prod --single-bundle --output-hashing none --vendor-chunk false",
      "buildrun": "npm run build:prod && lite-server --baseDir=dist/my-child",
      ```

- 1. 创建第二个微应用 `ng n my-library`，进入`my-library`，`ng add ngx-build-plus @angular/elements`，修改`package.json`与`bs-config.js`的操作是一样的，这里就不细说了
- 2. 创建 `library` 组件
      `ng g m library`

      `ng g c library --inlineStyle true --inlineTemplate true`
      ```js
      // library/library.module.ts
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
      
      ```
      ```js
      // library/library.component.ts
      import { Component, OnInit } from '@angular/core';
      import { Observable } from 'rxjs';
      
      import { Book, BooksService } from "./books.service";
      
      @Component({
        selector: 'app-library',
        template: `
          <h1>Library</h1>
          <ol *ngIf="books$ | async as books">
            <li *ngFor="let book of books">
	            <a [routerLink]="'/library/' + book.id">{{book.title}}</a>
            </li>
          </ol>
        `
      })
      export class LibraryComponent implements OnInit {
        books$: Observable<Book[]>;
      
        constructor(private booksService: BooksService) {
          this.books$ = this.booksService.books$;
        }
      
        ngOnInit(): void {
        }
      
      }
      
      ```
      ```js
      // library/library-routing.module.ts
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
      
      ```
      ```js
      // library/books.service.ts
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
      
      ```
      ```js
      // library/book-detail.component.ts
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
      ```
-  3.修改`app-routing.module.ts`，`app.component.html`，`app.component.ts`，`app.module.ts`
    ```js
    // app-routing.module.ts
    import { NgModule } from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';
    
    const routes: Routes = [
      {
        path: ':prefix/library',
        loadChildren: () => import('./library/library.module').then(m => m.LibraryModule),
      },
      {
        path: 'library',
        loadChildren: () => import('./library/library.module').then(m => m.LibraryModule),
      },
      {
        path: '**',
        redirectTo: '',
      }
    ];
    
    @NgModule({
      imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
      exports: [RouterModule]
    })
    export class AppRoutingModule { }
    
    ```
    ```html
    <!--app.component.html-->
    <header>
	    <h1>我的书单</h1>
	    <a [routerLink]="'/library'">书单</a>
    </header>
    <main>
	    <router-outlet></router-outlet>
    </main>
    ```
    ```ts
    // app.component.ts
    import { Component, Input } from '@angular/core';
    import { Location } from '@angular/common';
    import { Router, NavigationEnd } from '@angular/router';
    import { Subject } from 'rxjs';
    import { filter, takeUntil } from 'rxjs/operators';
    
    @Component({
      selector: 'my-library',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css']
    })
    export class AppComponent {
      @Input() routerPrefix = '';
      @Input() set navigateTo(url: string) {
        this.router.navigate([url]);
      }
    
      destroy$ = new Subject<any>();
	    
      constructor(private router: Router, private location: Location) {
    
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    
        this.router.events.pipe(
          filter((event) => event instanceof NavigationEnd),
          takeUntil(this.destroy$)
        ).subscribe((event) => {
          const url = (event as NavigationEnd).urlAfterRedirects;
    
          if (!url.startsWith(`/${this.routerPrefix}`)) {
            this.location.replaceState(this.routerPrefix + url);
          }
        });
      }
      
      ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
      }
    }
    
    ```
    ```js
    // app.module.ts
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
      imports: [L
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
    
    ```
    第二个微应用创建完毕

### 2.创建主应用 `parent-app`
- 1.`ng n parent-app`，进入`parent-app`执行`ng add @angular-extensions/elements`
- 2.创建`webcomponents`文件夹，并且在其文件下创建`child-app`，与`library-app`组件
  ```ts
  // child-app.component.ts
  import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

  @Component({
    selector: 'my-child',
    template: `<micro-child *axLazyElement="link" (emitDataToParent)="dataToParent($event)" [dataFromParent]="dataToChild"></micro-child>`,
    styles: []
  })
  export class ChildAppComponent implements OnInit {
    link: string = 'http://localhost:8084/main.js'

    @Input() dataToChild: string = "主服务传递到子子服务的数据";
    @Output() dataFromChild = new EventEmitter<string>()
    listOfData: string[] = [];

    constructor() { }

    dataToParent($event: any) {
      console.log($event)
      alert("由子服务转递过来的数据：" + $event.detail)
      this.dataFromChild.emit($event.detail);
    }

    ngOnInit(): void {
    }

  }

  ```
  ```ts
  // child-app.module.ts
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

  ```
  ```ts
  // library-app.component.ts
  import { Component, OnInit } from '@angular/core';
  import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
  import { filter, takeUntil } from 'rxjs/operators';
  import { Subject } from 'rxjs';

  @Component({
    selector: 'my-library',
    template: `<micro-library *axLazyElement="link" [routerPrefix]="routerPrefix" [navigateTo]="microUrl"></micro-library>`,
  })
  export class LibraryAppComponent implements OnInit {
    link: string = 'http://localhost:8083/main.js'
    public routerPrefix = '';
    public microUrl = '';

    destroy$ = new Subject<any>();

    constructor(private route: ActivatedRoute, private router: Router) {
      this.routerPrefix = this.route.parent?.snapshot.url.map((segment) => segment.path).join('/') || '';
      this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      ).subscribe((event) => {
        this.microUrl = this.getRoutePath(this.route);
      });
    }

    private getRoutePath(route: ActivatedRoute): string {
      return route?.snapshot.url.map((segment) => segment.path).join('/') || '';
    }

    ngOnInit(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }

  }

  ```
  ```ts
  // library-app.module.ts
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
  ```

- 3.修改`app.module.ts`, `app.component.html`, `app-routing.module.ts`
  ```ts
  // app.module.ts
  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { LazyElementsModule } from '@angular-extensions/elements';

  import { AppRoutingModule } from './app-routing.module';
  import { AppComponent } from './app.component';

  @NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      LazyElementsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
  })
  export class AppModule { }

  ```
  ```html
  <div id="app">
    <div style="flex: 1;">
        <ul>
            <li>
                <a [routerLink]="'/library-app'">书单</a>
            </li>
            <li>
                <a [routerLink]="'/child-app'">表单</a>
            </li>
        </ul>
    </div>
    
    <div style="flex: 6;">
        <router-outlet></router-outlet>
    </div>
  </div>

  <style>
      #app {
          display: flex;
          flex: 7;
      }
  </style>
  ```

  ```ts
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

  ```

主应用创建完毕
### 3.启动三个应用
- 1.进入`my-child`，执行`npm run buildrun`，访问`http://localhost:8084/`

- 2.进入`my-library`，执行`npm run buildrun`，访问`http://localhost:8083/`

- 3.进入`parent-app`，执行`npm run start`，访问`http://localhost:4200/`，可以访问`my-child`与`my-library`两个微应用

