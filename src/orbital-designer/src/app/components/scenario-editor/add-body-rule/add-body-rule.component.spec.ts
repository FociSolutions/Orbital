import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBodyRuleComponent } from './add-body-rule.component';

describe('AddBodyRuleComponent', () => {
  let component: AddBodyRuleComponent;
  let fixture: ComponentFixture<AddBodyRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBodyRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBodyRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
