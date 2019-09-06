import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestRequestInputComponent } from './rest-request-input.component';

describe('RestRequestInputComponent', () => {
  let component: RestRequestInputComponent;
  let fixture: ComponentFixture<RestRequestInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestRequestInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestRequestInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
