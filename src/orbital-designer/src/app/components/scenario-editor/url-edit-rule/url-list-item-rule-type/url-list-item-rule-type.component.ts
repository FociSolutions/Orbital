import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';
import { KeyValuePairRule } from '../../../../models/mock-definition/scenario/key-value-pair-rule.model';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { getRecordValueAtKey } from 'src/app/models/record';

@Component({
  selector: 'app-url-list-item-rule-type',
  templateUrl: './url-list-item-rule-type.component.html',
  styleUrls: ['./url-list-item-rule-type.component.scss']
})
export class UrlListItemRuleTypeComponent implements OnInit, OnDestroy, OnChanges {
  private subscriptions: Subscription[] = [];

  readonly rules = [
    { value: RuleType.REGEX, viewValue: 'Matches Regex' },
    { value: RuleType.TEXTEQUALS, viewValue: 'Equals' },
    { value: RuleType.ACCEPTALL, viewValue: 'Accept All' }
  ];

  @Input() index: number;
  @Input() urlEditRuleFormGroup: FormGroup;
  @Input() ruleIsDuplicatedIndex: Record<number, boolean>;
  private urlruleIsDuplicated = false;
  /**
   * The kvp to be deleted by the parent
   */
  @Output() urlRuleRemovedEventEmitter = new EventEmitter<KeyValuePairRule>();
  @Output() checkIfRuleIsDuplicatedEmitter = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      if (propName === 'ruleIsDuplicatedIndex') {
        console.log('Estos son mis simple changes', changes);
        const indexValueReturned = getRecordValueAtKey(this.ruleIsDuplicatedIndex, this.index, false);
        console.log('esto me devolvio!', indexValueReturned);
        console.log('desde el index ', this.index);
        if (!indexValueReturned) {
          this.ruleType.setErrors(null);
          this.urlruleIsDuplicated = false;
        } else {
          console.log('you found me');
          this.urlruleIsDuplicated = true;
        }
      }
    }
  }
  ngOnInit() {
    const ruleTypeSubscription = this.urlEditRuleFormGroup.get('ruleType').valueChanges.subscribe(type => {
      if (type === RuleType.ACCEPTALL) {
        this.path.disable();
        this.path.setValue('');
      } else {
        this.path.enable();
      }
      console.log('cambie desde rule en index ', this.index);
    });

    const pathSubscription = this.urlEditRuleFormGroup.get('path').valueChanges.subscribe(type => {
      console.log('cambie desde path en index ', this.index);
    });

    if (this.urlEditRuleFormGroup.controls.ruleType.value === RuleType.ACCEPTALL) {
      this.path.disable();
    }

    this.subscriptions.push(ruleTypeSubscription, pathSubscription);
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
    const removeRule = {
      rule: { urlPath: this.path.value },
      type: this.ruleType.value
    } as KeyValuePairRule;
    this.urlRuleRemovedEventEmitter.emit(removeRule);
  }

  /**
   * Implementation for NG On Destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  get isDuplicatedExistingRule(): boolean {
    if (this.urlruleIsDuplicated) {
      console.log('you are wrong bitch');
      this.urlEditRuleFormGroup.get('ruleType').setErrors({ incorrect: true });
      return this.urlruleIsDuplicated;
    }
  }
}
