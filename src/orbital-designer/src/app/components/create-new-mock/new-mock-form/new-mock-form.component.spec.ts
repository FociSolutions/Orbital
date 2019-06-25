import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMockFormComponent } from './new-mock-form.component';

describe('NewMockFormComponent', () => {
  let component: NewMockFormComponent;
  let fixture: ComponentFixture<NewMockFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMockFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMockFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
