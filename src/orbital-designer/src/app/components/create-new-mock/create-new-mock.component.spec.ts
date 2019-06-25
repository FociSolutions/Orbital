import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewMockComponent } from './create-new-mock.component';
import { NewMockFormComponent } from './new-mock-form/new-mock-form.component';
import { NewMockTitleComponent } from './new-mock-title/new-mock-title.component';

describe('CreateNewMockComponent', () => {
  let component: CreateNewMockComponent;
  let fixture: ComponentFixture<CreateNewMockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewMockComponent, NewMockFormComponent, NewMockTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewMockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
