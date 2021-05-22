import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryAppComponent } from './library-app.component';

describe('LibraryAppComponent', () => {
  let component: LibraryAppComponent;
  let fixture: ComponentFixture<LibraryAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibraryAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
