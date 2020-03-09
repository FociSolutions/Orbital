import { Component, OnInit, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BodyRule, defaultBodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { AddBodyRuleBuilder } from '../../add-body-rule-container/add-body-rule/add-body-rule-builder/add-body-rule.builder';
import { ValidJsonService } from 'src/app/services/valid-json/valid-json.service';

@Component({
  selector: 'app-body-add-rule',
  templateUrl: './body-add-rule.component.html',
  styleUrls: ['./body-add-rule.component.scss']
})
export class BodyAddRuleComponent implements OnInit, OnDestroy {
  /**
   * Stores the subscriptions that will be destroyed during OnDestroy
   */
  private subscriptions: Subscription[] = [];
  private bodyRuleInEdit = defaultBodyRule;
  private ruleIsDuplicated = false;

  @Input() bodyRuleAddedIsDuplicated = new EventEmitter<boolean>();
  @Output() bodyRuleAddedEventEmitter = new EventEmitter<BodyRule>();

  readonly rules = [
    { value: RuleType.REGEX, viewValue: 'Regex' },
    { value: RuleType.TEXTSTARTSWITH, viewValue: 'Text: Starts With' },
    { value: RuleType.TEXTENDSWITH, viewValue: 'Text: Ends With' },
    { value: RuleType.TEXTCONTAINS, viewValue: 'Text: Contains' },
    { value: RuleType.TEXTEQUALS, viewValue: 'Text: Equals' },
    { value: RuleType.JSONPATH, viewValue: 'JSON: Path' },
    { value: RuleType.JSONEQUALITY, viewValue: 'JSON: Equality' },
    { value: RuleType.JSONCONTAINS, viewValue: 'JSON: Contains' },
    { value: RuleType.JSONSCHEMA, viewValue: 'JSON: Schema' },
    { value: RuleType.ACCEPTALL, viewValue: 'Accept All' }
  ];

  bodyAddRuleFormGroup: FormGroup;

  constructor(private addBodyRuleBuilder: AddBodyRuleBuilder) {}
  ngOnInit() {
    const bodyDuplicatedSubscription = this.bodyRuleAddedIsDuplicated.subscribe(
      isDuplicated => (this.ruleIsDuplicated = isDuplicated)
    );

    this.bodyAddRuleFormGroup = this.addBodyRuleBuilder.createNewBodyRuleForm();
    this.bodyAddRuleFormGroup.controls.rule.setValue('');
    this.bodyRuleInEdit.rule = this.bodyAddRuleFormGroup.controls.rule.value;
    this.bodyRuleInEdit.type = this.bodyAddRuleFormGroup.controls.type.value;

    // the default rule is accept all, so the text field should be initially disabled
    this.rule.disable();

    const ruleSubscription = this.bodyAddRuleFormGroup.get('rule').valueChanges.subscribe(rule => {
      this.ruleIsDuplicated = false;
      this.bodyRuleInEdit.rule = rule;
    });

    const typeSubscription = this.bodyAddRuleFormGroup.get('type').valueChanges.subscribe(type => {
      this.ruleIsDuplicated = false;
      this.bodyRuleInEdit.type = type;

      if (type === RuleType.ACCEPTALL) {
        this.rule.disable();
        this.rule.setValue('');
      } else {
        this.rule.enable();
      }
    });

    this.subscriptions.push(ruleSubscription, typeSubscription, bodyDuplicatedSubscription);
    this.rule.disable();
  }

  /**
   *
   * Gets the boolean indicating if the rule to be added is duplicated.
   */
  get isRuleDuplicated(): boolean {
    return this.ruleIsDuplicated;
  }
  /**
   * Gets the form control for the 'rule'
   */
  get rule(): AbstractControl {
    return this.bodyAddRuleFormGroup.get('rule');
  }

  /**
   * Gets the form control for the 'type'
   */
  get type(): AbstractControl {
    return this.bodyAddRuleFormGroup.get('type');
  }

  /**
   * Controls the logic for emmiting a new addBodyRule event
   */
  addBodyRule(): void {
    if (this.bodyAddRuleFormGroup.valid) {
      this.bodyRuleAddedEventEmitter.emit(this.bodyRuleInEdit);
    }
  }

  /**
   * Implementation for NG On Destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
