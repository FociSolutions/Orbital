import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { RequestMatchRule } from 'src/app/models/mock-definition/scenario/request-match-rule.model';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule/body-rule.model';
import { FormArray, FormGroup } from '@angular/forms';
import { TokenRule } from 'src/app/models/mock-definition/scenario/token-rule.model';
import { Subscription } from 'rxjs';
import { ScenarioFormMapper } from '../scenario-form-builder/scenario-form.builder';

@Component({
  selector: 'app-add-request-match-rule',
  templateUrl: './add-request-match-rule.component.html',
  styleUrls: ['./add-request-match-rule.component.scss'],
})
export class AddRequestMatchRuleComponent implements OnInit, OnDestroy {
  formSubscription: Subscription;
  @Input() requestMatchRule: RequestMatchRule;
  @Output() requestMatchRuleOutput: EventEmitter<RequestMatchRule>;
  @Input() requestMatchRuleFormGroup: FormGroup;
  @Input() tokenRule: TokenRule;
  @Input() tokenRuleFormArray: FormArray;

  bodyMatchRules: BodyRule[];

  shouldSave: boolean;

  static readonly ruleTypesStatic = {
    header: 'Header Match Rules',
    query: 'Query Match Rules',
    url: 'URL Match Rules',
    body: 'Body Match Rules',
    token_payload: 'Token Payload Match Rules',
  } as const;

  readonly ruleTypes = AddRequestMatchRuleComponent.ruleTypesStatic;

  currentRuleType: keyof typeof AddRequestMatchRuleComponent.ruleTypesStatic;

  constructor(private scenarioFormMapper: ScenarioFormMapper) {
    this.requestMatchRuleOutput = new EventEmitter<RequestMatchRule>();
    this.bodyMatchRules = [];
    this.currentRuleType = 'header';
  }

  /*
   * Sets the save status
   */
  @Input()
  set saveStatus(save: boolean) {
    this.shouldSave = save;
  }

  ngOnInit(): void {
    this.formSubscription = this.tokenRuleFormArray.valueChanges.subscribe(() => {
      this.tokenRule.rules = this.scenarioFormMapper.GetKeyValuePairRulesFromForm(this.tokenRuleFormArray);
    });
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  /**
   * A sort comparison function that treats all objects as having the same order.
   * Needed until angular ticket 42490 is implemented: https://github.com/angular/angular/issues/42490
   * @returns 0
   */
  compareAllEqual(_a: unknown, _b: unknown) {
    return 0;
  }
}
