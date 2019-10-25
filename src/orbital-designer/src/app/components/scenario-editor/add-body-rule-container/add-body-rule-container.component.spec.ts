import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { AddBodyRuleContainerComponent } from './add-body-rule-container.component';
import { AddBodyRuleComponent } from './add-body-rule/add-body-rule.component';
import { MatFormFieldModule, MatInputModule, MatCardModule, MatIconModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as faker from 'faker';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule.type';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';

describe('AddBodyRuleContainerComponent', () => {
  let component: AddBodyRuleContainerComponent;
  let fixture: ComponentFixture<AddBodyRuleContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBodyRuleContainerComponent, AddBodyRuleComponent ],
      imports: [ MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatIconModule,
        FormsModule,
        BrowserAnimationsModule,
        LoggerTestingModule,
        MatDividerModule,
        MatCheckboxModule ]
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

  describe('add-body-rule-container.addBodyRule', () => {
    it('should add a body rule', () => {
      const bodyRuleToAdd = {type: BodyRuleType.BodyEquality, rule: {a: 'b'}} as BodyRule;
      component.addBodyRule(bodyRuleToAdd);
      const Actual = component.bodyRules;
      expect([bodyRuleToAdd]).toEqual(Actual);
    });

    it('should not add an empty body rule', () => {
      const bodyRuleToAdd = {} as BodyRule;
      component.addBodyRule(bodyRuleToAdd);
      const Actual = component.bodyRules;
      expect(Actual.length).toBe(0);
    });
  });
});
