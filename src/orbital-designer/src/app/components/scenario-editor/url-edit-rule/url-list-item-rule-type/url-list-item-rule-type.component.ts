import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';
import { KeyValuePairRule } from '../../../../models/mock-definition/scenario/key-value-pair-rule.model';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-url-list-item-rule-type',
  templateUrl: './url-list-item-rule-type.component.html',
  styleUrls: ['./url-list-item-rule-type.component.scss'],
})
export class UrlListItemRuleTypeComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  readonly rules = [
    { value: RuleType.REGEX, viewValue: 'Matches Regex' },
    { value: RuleType.TEXTEQUALS, viewValue: 'Equals' },
    { value: RuleType.ACCEPTALL, viewValue: 'Accept All' },
  ];

  @Input() urlEditRuleFormGroup: FormGroup;
  /**
   * The kvp to be deleted by the parent
   */
  @Output() urlRuleRemovedEventEmitter = new EventEmitter<KeyValuePairRule>();

  ngOnInit() {
    const ruleTypeSubscription = this.urlEditRuleFormGroup.get('ruleType').valueChanges.subscribe((type) => {
      if (type === RuleType.ACCEPTALL) {
        this.path.disable();
        this.path.setValue('');
        this.urlEditRuleFormGroup.markAsUntouched();
      } else {
        this.path.enable();
      }
      this.urlEditRuleFormGroup.updateValueAndValidity();
    });

    if (this.urlEditRuleFormGroup.controls.ruleType.value === RuleType.ACCEPTALL) {
      this.path.disable();
      this.urlEditRuleFormGroup.markAsUntouched();
    }

    this.subscriptions.push(ruleTypeSubscription);
  }

  /**
   * Gets the form control for the 'path'
   */
  get path(): AbstractControl {
    return this.urlEditRuleFormGroup.get('path');
  }

  /**
   * Gets the value from the current url rule type
   */

  get ruleType(): AbstractControl {
    return this.urlEditRuleFormGroup.get('ruleType');
  }

  /**
   * Emits a removes event with the KeyValue for the parent to remove
   */
  onRemove() {
    const removeRule: KeyValuePairRule = {
      rule: { urlPath: this.path.value },
      type: this.ruleType.value,
    };
    this.urlRuleRemovedEventEmitter.emit(removeRule);
  }

  /**
   * Implementation for NG On Destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
