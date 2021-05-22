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
