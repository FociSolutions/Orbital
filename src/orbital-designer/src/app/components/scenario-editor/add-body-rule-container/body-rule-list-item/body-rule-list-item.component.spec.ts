import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyRuleListItemComponent } from './body-rule-list-item.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule, MatIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { GetRuleTypeStringPipe } from 'src/app/pipes/get-rule-type-string/get-rule-type-string.pipe';

describe('BodyRuleListItemComponent', () => {
  let component: BodyRuleListItemComponent;
  let fixture: ComponentFixture<BodyRuleListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BodyRuleListItemComponent, GetRuleTypeStringPipe],
      imports: [
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        LoggerTestingModule,
        MatIconModule,
        FormsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyRuleListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('body-rule-list-item.deleteBodyRule', () => {
    it('should emit an event containing the deleted body rule when deleting a body rule', () => {
      const bodyRule = {
        rule: { a: 'b' },
        type: RuleType.JSONEQUALITY
      } as BodyRule;

      component.bodyRule = bodyRule;
      component.deleteBodyRule(bodyRule);

      component.deletedBodyRule.subscribe(
        actual => expect(actual).toEqual(bodyRule),
        err => fail(`Unexpected error: ${err.message}`)
      );
    });
  });

  describe('body-rule-list-item.getBodyRule', () => {
    it('should get a body rule successfully', () => {
      const bodyRule = { rule: { a: 'b' }, type: RuleType.JSONEQUALITY };
      component.bodyRule = bodyRule;
      expect(component.getBodyRule()).toEqual(JSON.stringify(bodyRule.rule));
    });

    it('should not get an invalid body rule', () => {
      const bodyRule = { rule: undefined, type: RuleType.JSONEQUALITY };
      component.bodyRule = bodyRule;
      expect(component.getBodyRule()).toEqual('');
    });
  });

  describe('body-rule-list-item.getBodyType', () => {
    it('should get a valid body type', () => {
      const bodyRule = { rule: {}, type: RuleType.JSONEQUALITY };
      component.bodyRule = bodyRule;
      expect(component.getBodyType() === RuleType[bodyRule.type]);
    });

    it('should not get an invalid body type', () => {
      const bodyRule = { rule: {}, type: undefined };
      component.bodyRule = bodyRule;
      expect(component.getBodyType()).toEqual('');
    });
  });
});
