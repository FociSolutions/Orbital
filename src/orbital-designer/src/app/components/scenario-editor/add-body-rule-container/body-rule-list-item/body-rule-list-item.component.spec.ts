import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyRuleListItemComponent } from './body-rule-list-item.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule, MatIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule.type';

describe('BodyRuleListItemComponent', () => {
  let component: BodyRuleListItemComponent;
  let fixture: ComponentFixture<BodyRuleListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodyRuleListItemComponent ],
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

  it('should emit an event containing the deleted body rule when deleting a body rule', () => {
    const bodyRule = {rule: {a: 'b'}, type: BodyRuleType.BodyEquality};
    component.bodyRule = bodyRule;

    spyOn(component.deletedBodyRule, 'emit');
    component.deleteBodyRule(bodyRule);
    expect(component.deletedBodyRule.emit).toHaveBeenCalledWith(bodyRule);
  });
});
