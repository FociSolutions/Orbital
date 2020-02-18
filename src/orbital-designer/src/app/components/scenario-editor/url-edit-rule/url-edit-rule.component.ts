import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { KeyValuePairRule } from '../../../models/mock-definition/scenario/key-value-pair-rule.model';
import { recordFirstOrDefault } from '../../../models/record';
import { Subscription } from 'rxjs';
import { ScenarioFormBuilder } from '../scenario-form-builder/scenario-form.builder';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-url-edit-rule',
  templateUrl: './url-edit-rule.component.html',
  styleUrls: ['./url-edit-rule.component.scss']
})
export class UrlEditRuleComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  @Output() urlRuleIsDuplicated: EventEmitter<boolean>;
  @Input() urlMatchRuleFormArray: FormArray;
  constructor(private logger: NGXLogger, private formbuilder: ScenarioFormBuilder) {
    this.urlRuleIsDuplicated = new EventEmitter<boolean>();
    this.urlRuleIsDuplicated.emit(false);
  }

  ngOnInit(): void {
    const urlMatchRuleFormArraySubscription = this.urlMatchRuleFormArray.valueChanges.subscribe(rules => {
      this.logger.debug('UrlEditRuleComponent checking for duplicate rules : ', this.urlMatchRuleFormArray);
      this.checkForDuplicates();
    });
    this.subscriptions.push(urlMatchRuleFormArraySubscription);
  }

  /**
   * This method listens to the event emitter from the child component and adds the KeyValue pair into the list
   * @param kvp The KeyValue pair rule being taken in from the child component to be added
   */
  addUrlEditRuleHandler(kvpToAdd: KeyValuePairRule) {
    const ruleFound = this.isUrlRuleDuplicate(kvpToAdd);
    if (!ruleFound) {
      this.urlRuleIsDuplicated.emit(false);
      const index = this.urlMatchRuleFormArray.length;
      const newUrlRuleControl = this.formbuilder.getUrlItemFormGroup(kvpToAdd);
      this.urlMatchRuleFormArray.insert(index, newUrlRuleControl);
      this.logger.debug('UrlEditRuleComponent new rule added : ', kvpToAdd);
    } else {
      this.urlRuleIsDuplicated.emit(true);
    }
  }

  /**
   * This method listens to the event emitter from the child component and deletes the KeyValue pair from the list
   * @param kvp The KeyValue pair rule being taken in from the child component to be deleted
   */
  deleteUrlEditRuleHandler(indexPosition: number) {
    this.urlMatchRuleFormArray.removeAt(indexPosition);
    this.logger.debug('Delete Path Rule from url list at index: ', indexPosition);
  }

  /**
   * checks if the keyvaluepairrule is inside the current form array
   *
   */
  private isUrlRuleDuplicate(kvpToAdd: KeyValuePairRule): boolean {
    interface UrlRuleFormGroup {
      path: string;
      ruleType: number;
    }

    return this.urlMatchRuleFormArray.controls
      .map(group => {
        return (group as FormGroup).getRawValue() as UrlRuleFormGroup;
      })
      .some(urlFormGroup => {
        return urlFormGroup.path === recordFirstOrDefault(kvpToAdd.rule, '') && urlFormGroup.ruleType === kvpToAdd.type;
      });
  }

  /**
   *
   * Double check to confirm there are no duplicates in the list of existing url rules
   */
  private checkForDuplicates(): void {
    this.urlMatchRuleFormArray.setErrors(null);
    this.urlMatchRuleFormArray.markAsUntouched();
    interface UrlRuleFormGroup {
      path?: string;
      ruleType: number;
    }
    const urlRules = this.urlMatchRuleFormArray.controls.map(group => {
      return (group as FormGroup).getRawValue() as UrlRuleFormGroup;
    });
    urlRules.forEach((urlToCheck, indexToCheck) => {
      urlRules.forEach((urlToCheckAgainst, indexToCheckAgainst) => {
        const foundDuplicate =
          urlToCheck.path === urlToCheckAgainst.path &&
          urlToCheck.ruleType === urlToCheckAgainst.ruleType &&
          indexToCheck !== indexToCheckAgainst;
        if (foundDuplicate) {
          (this.urlMatchRuleFormArray.at(indexToCheck) as FormGroup).get('path').markAsTouched();
          (this.urlMatchRuleFormArray.at(indexToCheck) as FormGroup).get('ruleType').markAsTouched();
          (this.urlMatchRuleFormArray.at(indexToCheckAgainst) as FormGroup).get('path').markAsTouched();
          (this.urlMatchRuleFormArray.at(indexToCheckAgainst) as FormGroup).get('ruleType').markAsTouched();
          this.urlMatchRuleFormArray.setErrors({ duplicated: true });
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
