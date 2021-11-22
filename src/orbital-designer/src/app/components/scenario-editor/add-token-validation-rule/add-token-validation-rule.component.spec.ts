import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { defaultTokenRule } from 'src/app/models/mock-definition/scenario/token-rule.model';
import { OrbitalCommonModule } from '../../orbital-common/orbital-common.module';
import { KvpEditRuleComponent } from '../kvp-edit-rule/kvp-edit-rule.component';
import { KvpListItemRuleTypeComponent } from '../kvp-edit-rule/kvp-list-item-rule-type/kvp-list-item-rule-type.component';
import { ScenarioFormBuilder } from '../scenario-form-builder/scenario-form.builder';

import { AddTokenValidationRuleComponent } from './add-token-validation-rule.component';

describe('AddTokenValidationRuleComponent', () => {
  let component: AddTokenValidationRuleComponent;
  let fixture: ComponentFixture<AddTokenValidationRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddTokenValidationRuleComponent,
        KvpEditRuleComponent,
        KvpListItemRuleTypeComponent
      ],
      imports: [
        OrbitalCommonModule,
        BrowserAnimationsModule,
        MatCardModule,
        LoggerTestingModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTokenValidationRuleComponent);
    component = fixture.componentInstance;
    component.tokenRule = defaultTokenRule;

    const scenarioFormBuilder = TestBed.get(ScenarioFormBuilder) as ScenarioFormBuilder;
    component.tokenRuleFormArray = scenarioFormBuilder.tokenRuleFormArray(component.tokenRule);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
