import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMockTitleComponent } from './new-mock-title.component';

describe('NewMockTitleComponent', () => {
  let component: NewMockTitleComponent;
  let fixture: ComponentFixture<NewMockTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMockTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMockTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
