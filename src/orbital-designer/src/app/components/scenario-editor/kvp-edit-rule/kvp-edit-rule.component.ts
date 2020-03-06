import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { recordFirstOrDefaultKey, recordFirstOrDefault } from 'src/app/models/record';
import { FormArray, FormGroup } from '@angular/forms';
import { ScenarioFormBuilder } from '../scenario-form-builder/scenario-form.builder';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-kvp-edit-rule',
  templateUrl: './kvp-edit-rule.component.html',
  styleUrls: ['./kvp-edit-rule.component.scss']
})
export class KvpEditRuleComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  /**
   * The add and list tiles to be added in the template
   */
  @Input() addKvpTitle: string;

  @Input() matchRuleFormArray: FormArray;

  @Output() kvpIsDuplicated: EventEmitter<boolean>;

  constructor(private logger: NGXLogger, private formbuilder: ScenarioFormBuilder) {
    this.kvpIsDuplicated = new EventEmitter<boolean>();
    this.kvpIsDuplicated.emit(false);
  }

  ngOnInit(): void {
    const matchRuleFormArraySubscription = this.matchRuleFormArray.valueChanges.subscribe(rules => {
      this.logger.debug('KvpEditRuleComponent checking for duplicate rules : ', this.matchRuleFormArray);
      this.checkForDuplicates();
    });
    this.subscriptions.push(matchRuleFormArraySubscription);
  }

  /**
   * This method listens to the event emitter from the child component and deletes the KeyValue pair from the list
   * @param indexPosition The KeyValue pair rule being taken in from the child component to be deleted
   */
  deleteKvpFromRule(indexPosition: number) {
    this.matchRuleFormArray.removeAt(indexPosition);
    this.logger.debug('Delete Rule from list at index ', indexPosition);
  }

  /**
   * This method listens to the event emitter from the child component and adds the KeyValue pair into the list
   * @param kvp The KeyValue pair rule being taken in from the child component to be added
   */
  addKvp(kvpToAdd: KeyValuePairRule) {
    const rulefound = this.isRuleDuplicate(kvpToAdd);
    if (!rulefound) {
      this.kvpIsDuplicated.emit(false);
      const index = this.matchRuleFormArray.length;
      const newRuleControl = this.formbuilder.getHeaderOrQueryItemFormGroup(kvpToAdd);
      this.matchRuleFormArray.insert(index, newRuleControl);
      this.logger.debug('KvpEditRuleComponent: new rule added ', kvpToAdd);
    } else {
      this.kvpIsDuplicated.emit(true);
    }
  }

  /**
   * checks if the keyvaluepairrule is inside the current form array
   *
   */
  private isRuleDuplicate(kvpToAdd: KeyValuePairRule): boolean {
    interface HeaderQueryRuleFormGroup {
      key: string;
      value: string;
      type: number;
    }

    return this.matchRuleFormArray.controls
      .map(group => {
        return (group as FormGroup).getRawValue() as HeaderQueryRuleFormGroup;
      })
      .some(kvFormGroup => {
        return (
          kvFormGroup.value === recordFirstOrDefault(kvpToAdd.rule, '') &&
          kvFormGroup.key === recordFirstOrDefaultKey(kvpToAdd.rule, '') &&
          kvFormGroup.type === kvpToAdd.type
        );
      });
  }

  /**
   *
   * Double check to confirm there are no duplicates in the list of existing rules
   */
  private checkForDuplicates(): void {
    this.matchRuleFormArray.controls.forEach(c => c.setErrors(null));
    this.matchRuleFormArray.markAsUntouched();
    interface HeaderQueryRuleFormGroup {
      key: string;
      value: string;
      type: number;
    }
    const rules = this.matchRuleFormArray.controls.map(group => {
      return (group as FormGroup).getRawValue() as HeaderQueryRuleFormGroup;
    });
    rules.forEach((ruleToCheck, indexToCheck) => {
      rules.forEach((ruleToCheckAgainst, indexToCheckAgainst) => {
        const foundDuplicate =
          ruleToCheck.value === ruleToCheckAgainst.value &&
          ruleToCheck.key === ruleToCheckAgainst.key &&
          ruleToCheck.type === ruleToCheckAgainst.type &&
          indexToCheck !== indexToCheckAgainst;
        if (foundDuplicate) {
          this.logger.error('KvpEditRuleComponent: found duplicate', ruleToCheck);
          (this.matchRuleFormArray.at(indexToCheck) as FormGroup).get('type').markAsTouched();
          (this.matchRuleFormArray.at(indexToCheckAgainst) as FormGroup).get('type').markAsTouched();
          (this.matchRuleFormArray.at(indexToCheckAgainst) as FormGroup).setErrors({ duplicated: true });
          (this.matchRuleFormArray.at(indexToCheck) as FormGroup).setErrors({ duplicated: true });
        }
      });
    });
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
