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
