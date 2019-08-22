import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewMockViewComponent } from './create-new-mock-view.component';

describe('CreateNewMockViewComponent', () => {
  let component: CreateNewMockViewComponent;
  let fixture: ComponentFixture<CreateNewMockViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewMockViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewMockViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
