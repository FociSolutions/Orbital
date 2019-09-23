import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShuttleListComponent } from './shuttle-list.component';

describe('ShuttleListComponent', () => {
  let component: ShuttleListComponent;
  let fixture: ComponentFixture<ShuttleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShuttleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShuttleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
