import { Component, OnInit, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

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
    rule: { bodyPath: '' } as Record<string, string>,
    type: RuleType.ACCEPTALL
  } as KeyValuePairRule;
  private ruleIsDuplicated = false;

  @Input() bodyRuleAddedIsDuplicated = new EventEmitter<boolean>();
  @Output() bodyRuleAddedEventEmitter = new EventEmitter<KeyValuePairRule>();

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
      path: new FormControl(this.bodyRuleInEdit.rule['bodyPath'], [Validators.required, Validators.maxLength(3000)]),
      ruleType: new FormControl(this.bodyRuleInEdit.type, [Validators.required])
    });

    const pathSubscription = this.bodyAddRuleFormGroup.get('rule').valueChanges.subscribe(path => {
      this.ruleIsDuplicated = false;
      this.bodyRuleInEdit.rule['bodyPath'] = path;
    });

    const ruleTypeSubscription = this.bodyAddRuleFormGroup.get('type').valueChanges.subscribe(type => {
      this.ruleIsDuplicated = false;
      this.bodyRuleInEdit.type = type;

      if (type === RuleType.ACCEPTALL) {
        this.path.disable();
        this.path.setValue('');
      } else {
        this.path.enable();
      }
    });

    this.subscriptions.push(pathSubscription, ruleTypeSubscription, bodyDuplicatedSubscription);
    this.path.disable();
  }

  /**
   *
   * Gets the boolean indicating if the rule to be added is duplicated.
   */
  get isRuleDuplicated(): boolean {
    return this.ruleIsDuplicated;
  }
  /**
   * Gets the form control for the 'path'
   */
  get path(): AbstractControl {
    return this.bodyAddRuleFormGroup.get('path');
  }

  /**
   * Gets the form control for the 'ruleType'
   */
  get ruleType(): AbstractControl {
    return this.bodyAddRuleFormGroup.get('ruleType');
  }

  /**
   * Controls the logic for emmiting a new addbodyRule event
   */
  addbodyRule(): void {
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
