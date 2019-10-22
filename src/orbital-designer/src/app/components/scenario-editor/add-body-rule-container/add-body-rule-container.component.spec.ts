import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBodyRuleContainerComponent } from './add-body-rule-container.component';

describe('AddBodyRuleContainerComponent', () => {
  let component: AddBodyRuleContainerComponent;
  let fixture: ComponentFixture<AddBodyRuleContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBodyRuleContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBodyRuleContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
