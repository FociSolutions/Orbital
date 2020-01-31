import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlListItemRuleTypeComponent } from './url-list-item-rule-type.component';

describe('UrlListItemRuleTypeComponent', () => {
  let component: UrlListItemRuleTypeComponent;
  let fixture: ComponentFixture<UrlListItemRuleTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlListItemRuleTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlListItemRuleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
