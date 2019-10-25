import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyRuleListItemComponent } from './body-rule-list-item.component';

describe('BodyRuleListItemComponent', () => {
  let component: BodyRuleListItemComponent;
  let fixture: ComponentFixture<BodyRuleListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodyRuleListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyRuleListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
