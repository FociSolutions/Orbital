import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { recordFirstOrDefault } from '../../../models/record';
import { Subscription } from 'rxjs';
import { FormArray, FormGroup } from '@angular/forms';
import { AddBodyRuleBuilder } from '../add-body-rule-container/add-body-rule/add-body-rule-builder/add-body-rule.builder';

@Component({
  selector: 'app-body-edit-rule',
  templateUrl: './body-edit-rule.component.html',
  styleUrls: ['./body-edit-rule.component.scss']
})
export class BodyEditRuleComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  @Output() bodyRuleIsDuplicated: EventEmitter<boolean>;
  @Input() bodyMatchRuleFormArray: FormArray;
  constructor(private logger: NGXLogger, private formbuilder: AddBodyRuleBuilder) {
    this.bodyRuleIsDuplicated = new EventEmitter<boolean>();
    this.bodyRuleIsDuplicated.emit(false);
  }

  ngOnInit(): void {
    // TODO
    /*const bodyMatchRuleFormArraySubscription = this.bodyMatchRuleFormArray.valueChanges.subscribe(() => {
      this.logger.debug('BodyEditRuleComponent checking for duplicate rules : ', this.bodyMatchRuleFormArray);
      this.checkForDuplicates();
    });*/
    //this.subscriptions.push(bodyMatchRuleFormArraySubscription);
  }

  /**
   * This method listens to the event emitter from the child component and adds the KeyValue pair into the list
   * @param kvp The KeyValue pair rule being taken in from the child component to be added
   */
  addBodyEditRuleHandler(kvpToAdd: any) {
    const ruleFound = this.isBodyRuleDuplicate(kvpToAdd);
    if (!ruleFound) {
      this.bodyRuleIsDuplicated.emit(false);
      const index = this.bodyMatchRuleFormArray.length;
      const newBodyRuleControl = this.formbuilder.createBodyRuleForm(kvpToAdd);
      this.bodyMatchRuleFormArray.insert(index, newBodyRuleControl);
      this.logger.debug('BodyEditRuleComponent new rule added : ', kvpToAdd);
    } else {
      this.bodyRuleIsDuplicated.emit(true);
    }
  }

  /**
   * This method listens to the event emitter from the child component and deletes the KeyValue pair from the list
   * @param kvp The KeyValue pair rule being taken in from the child component to be deleted
   */
  deleteBodyEditRuleHandler(indexPosition: number) {
    this.bodyMatchRuleFormArray.removeAt(indexPosition);
    this.logger.debug('Delete rule Rule from body list at index: ', indexPosition);
  }

  /**
   * checks if the keyvaluepairrule is inside the current form array
   *
   */
  private isBodyRuleDuplicate(kvpToAdd: any): boolean {
    interface BodyRuleFormGroup {
      rule: string;
      type: number;
    }

    return this.bodyMatchRuleFormArray.controls
      .map(group => {
        return (group as FormGroup).getRawValue() as BodyRuleFormGroup;
      })
      .some(bodyFormGroup => {
        return bodyFormGroup.rule === recordFirstOrDefault(kvpToAdd.rule, '') && bodyFormGroup.type === kvpToAdd.type;
      });
  }

  /**
   *
   * Double check to confirm there are no duplicates in the list of existing body rules
   */
  private checkForDuplicates(): void {
    this.bodyMatchRuleFormArray.setErrors(null);
    this.bodyMatchRuleFormArray.markAsUntouched();
    interface BodyRuleFormGroup {
      rule?: string;
      type: number;
    }
    const bodyRules = this.bodyMatchRuleFormArray.controls.map(group => {
      return (group as FormGroup).getRawValue() as BodyRuleFormGroup;
    });
    bodyRules.forEach((bodyToCheck, indexToCheck) => {
      bodyRules.forEach((bodyToCheckAgainst, indexToCheckAgainst) => {
        const foundDuplicate =
          bodyToCheck.rule === bodyToCheckAgainst.rule &&
          bodyToCheck.type === bodyToCheckAgainst.type &&
          indexToCheck !== indexToCheckAgainst;
        if (foundDuplicate) {
          (this.bodyMatchRuleFormArray.at(indexToCheck) as FormGroup).get('rule').markAsTouched();
          (this.bodyMatchRuleFormArray.at(indexToCheck) as FormGroup).get('type').markAsTouched();
          (this.bodyMatchRuleFormArray.at(indexToCheckAgainst) as FormGroup).get('rule').markAsTouched();
          (this.bodyMatchRuleFormArray.at(indexToCheckAgainst) as FormGroup).get('type').markAsTouched();
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
