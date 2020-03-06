import { Component, OnInit, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';

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
  private bodyRuleInEdit = {
    rule: {},
    type: RuleType.ACCEPTALL
  } as BodyRule;
  private ruleIsDuplicated = false;

  @Input() bodyRuleAddedIsDuplicated = new EventEmitter<boolean>();
  @Output() bodyRuleAddedEventEmitter = new EventEmitter<BodyRule>();

  readonly rules = [
    { value: RuleType.REGEX, viewValue: 'Matches Regex' },
    { value: RuleType.ACCEPTALL, viewValue: 'Accept All' },
    { value: RuleType.TEXTEQUALS, viewValue: 'Equals' }
  ];

  bodyAddRuleFormGroup: FormGroup;
  ngOnInit() {
    const bodyDuplicatedSubscription = this.bodyRuleAddedIsDuplicated.subscribe(
      isDuplicated => (this.ruleIsDuplicated = isDuplicated)
    );
    this.bodyAddRuleFormGroup = new FormGroup({
      rule: new FormControl(this.bodyRuleInEdit.rule, [Validators.required, Validators.maxLength(3000)]),
      type: new FormControl(this.bodyRuleInEdit.type, [Validators.required])
    });

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
