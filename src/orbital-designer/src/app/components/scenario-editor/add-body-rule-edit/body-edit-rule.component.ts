import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { KeyValuePairRule } from '../../../models/mock-definition/scenario/key-value-pair-rule.model';
import { recordFirstOrDefault } from '../../../models/record';
import { Subscription } from 'rxjs';
import { ScenarioFormBuilder } from '../scenario-form-builder/scenario-form.builder';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-body-edit-rule',
  templateUrl: './body-edit-rule.component.html',
  styleUrls: ['./body-edit-rule.component.scss']
})
export class BodyEditRuleComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  @Output() bodyRuleIsDuplicated: EventEmitter<boolean>;
  @Input() bodyMatchRuleFormArray: FormArray;
  constructor(private logger: NGXLogger, private formbuilder: ScenarioFormBuilder) {
    this.bodyRuleIsDuplicated = new EventEmitter<boolean>();
    this.bodyRuleIsDuplicated.emit(false);
  }

  ngOnInit(): void {
    const bodyMatchRuleFormArraySubscription = this.bodyMatchRuleFormArray.valueChanges.subscribe(rules => {
      this.logger.debug('bodyEditRuleComponent checking for duplicate rules : ', this.bodyMatchRuleFormArray);
      this.checkForDuplicates();
    });
    this.subscriptions.push(bodyMatchRuleFormArraySubscription);
  }

  /**
   * This method listens to the event emitter from the child component and adds the KeyValue pair into the list
   * @param kvp The KeyValue pair rule being taken in from the child component to be added
   */
  addbodyEditRuleHandler(kvpToAdd: any) {
    const ruleFound = this.isbodyRuleDuplicate(kvpToAdd);
    if (!ruleFound) {
      this.bodyRuleIsDuplicated.emit(false);
      const index = this.bodyMatchRuleFormArray.length;
      const newbodyRuleControl = this.formbuilder.getBodyItemFormGroup(kvpToAdd);
      this.bodyMatchRuleFormArray.insert(index, newbodyRuleControl);
      this.logger.debug('bodyEditRuleComponent new rule added : ', kvpToAdd);
    } else {
      this.bodyRuleIsDuplicated.emit(true);
    }
  }

  /**
   * This method listens to the event emitter from the child component and deletes the KeyValue pair from the list
   * @param kvp The KeyValue pair rule being taken in from the child component to be deleted
   */
  deletebodyEditRuleHandler(indexPosition: number) {
    this.bodyMatchRuleFormArray.removeAt(indexPosition);
    this.logger.debug('Delete Path Rule from body list at index: ', indexPosition);
  }

  /**
   * checks if the keyvaluepairrule is inside the current form array
   *
   */
  private isbodyRuleDuplicate(kvpToAdd: any): boolean {
    return false; // TODO: fix
  }

  /**
   *
   * Double check to confirm there are no duplicates in the list of existing body rules
   */
  private checkForDuplicates(): void {
    this.bodyMatchRuleFormArray.setErrors(null);
    this.bodyMatchRuleFormArray.markAsUntouched();
    interface bodyRuleFormGroup {
      path?: string;
      ruleType: number;
    }
    const bodyRules = this.bodyMatchRuleFormArray.controls.map(group => {
      return (group as FormGroup).getRawValue() as bodyRuleFormGroup;
    });
    bodyRules.forEach((bodyToCheck, indexToCheck) => {
      bodyRules.forEach((bodyToCheckAgainst, indexToCheckAgainst) => {
        const foundDuplicate =
          bodyToCheck.path === bodyToCheckAgainst.path &&
          bodyToCheck.ruleType === bodyToCheckAgainst.ruleType &&
          indexToCheck !== indexToCheckAgainst;
        if (foundDuplicate) {
          (this.bodyMatchRuleFormArray.at(indexToCheck) as FormGroup).get('path').markAsTouched();
          (this.bodyMatchRuleFormArray.at(indexToCheck) as FormGroup).get('ruleType').markAsTouched();
          (this.bodyMatchRuleFormArray.at(indexToCheckAgainst) as FormGroup).get('path').markAsTouched();
          (this.bodyMatchRuleFormArray.at(indexToCheckAgainst) as FormGroup).get('ruleType').markAsTouched();
          this.bodyMatchRuleFormArray.setErrors({ duplicated: true });
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
