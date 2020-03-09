import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';

@Component({
  selector: 'app-body-list-item-rule-type',
  templateUrl: './body-list-item-rule-type.component.html',
  styleUrls: ['./body-list-item-rule-type.component.scss']
})
export class BodyListItemRuleTypeComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  readonly rules = [
    { value: RuleType.REGEX, viewValue: 'Matches Regex' },
    { value: RuleType.TEXTEQUALS, viewValue: 'Equals' },
    { value: RuleType.ACCEPTALL, viewValue: 'Accept All' }
  ];

  @Input() bodyEditRuleFormGroup: FormGroup;
  /**
   * The kvp to be deleted by the parent
   */
  @Output() bodyRuleRemovedEventEmitter = new EventEmitter<BodyRule>();

  ngOnInit() {
    const typeSubscription = this.bodyEditRuleFormGroup.get('type').valueChanges.subscribe(type => {
      if (type === RuleType.ACCEPTALL) {
        this.rule.disable();
        this.rule.setValue('');
      } else {
        this.rule.enable();
      }
    });
    this.subscriptions.push(typeSubscription);
  }

  /**
   * Gets the form control for the 'rule'
   */
  get rule(): AbstractControl {
    return this.bodyEditRuleFormGroup.get('rule');
  }

  /**
   * Gets the value from the current body rule type
   */

  get type(): AbstractControl {
    return this.bodyEditRuleFormGroup.get('type');
  }

  /**
   * Emits a removes event with the KeyValue for the parent to remove
   */
  onRemove() {
    const removeRule = {
      rule: { bodyrule: this.rule.value },
      type: this.type.value
    } as BodyRule;
    this.bodyRuleRemovedEventEmitter.emit(removeRule);
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
