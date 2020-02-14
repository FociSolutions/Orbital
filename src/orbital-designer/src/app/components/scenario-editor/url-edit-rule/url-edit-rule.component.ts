import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { KeyValuePairRule } from '../../../models/mock-definition/scenario/key-value-pair-rule.model';
import { recordFirstOrDefault, recordAdd } from '../../../models/record';
import { Subscription } from 'rxjs';
import { ScenarioFormBuilder } from '../scenario-form-builder/scenario-form.builder';
import { FormArray, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-url-edit-rule',
  templateUrl: './url-edit-rule.component.html',
  styleUrls: ['./url-edit-rule.component.scss']
})
export class UrlEditRuleComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  @Output() urlRuleIsDuplicated: EventEmitter<boolean>;
  @Output() existingUrlRuleAtIndecIsDuplicated: Record<number, boolean>;
  @Input() urlMatchRuleFormArray: FormArray;
  constructor(private logger: NGXLogger, private formbuilder: ScenarioFormBuilder) {
    this.urlRuleIsDuplicated = new EventEmitter<boolean>();
    this.existingUrlRuleAtIndecIsDuplicated = {} as Record<number, boolean>;
    //this.existingUrlRuleAtIndecIsDuplicated = new EventEmitter<Record<number, boolean>>();
    //this.existingUrlRuleAtIndecIsDuplicated.emit({} as Record<number, boolean>);
    this.urlRuleIsDuplicated.emit(false);
  }

  ngOnInit(): void {
    const urlMatchRuleFormArraySubscription = this.urlMatchRuleFormArray.valueChanges.subscribe(rules => {
      console.log('List updated!');
      this.checkForMoreDuplicates();
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
    this.checkForMoreDuplicates();
    // if (!this.checkForMoreDuplicates()) {
    //   this.existingUrlRuleAtIndecIsDuplicated.emit({} as Record<number, boolean>);
    // }
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
   * Check if the modified existing url rules is not a duplicate of another existing rule
   * @param indexPosition Index position of the url rule that was modified
   */
  isExistingUrlRuleDuplicated(indexPosition: number): void {
    interface UrlRuleFormGroup {
      path?: string;
      ruleType: number;
    }
    const checkRecords = {} as Record<number, boolean>;
    const UrlRuleToFind = (this.urlMatchRuleFormArray.at(indexPosition) as FormGroup).getRawValue() as UrlRuleFormGroup;
    const currentUrlRules = this.urlMatchRuleFormArray.controls.map(group => {
      return (group as FormGroup).getRawValue() as UrlRuleFormGroup;
    });
    const rulesFoundIndex = currentUrlRules.findIndex(
      (urlFormGroup, index) =>
        urlFormGroup.path === UrlRuleToFind.path &&
        urlFormGroup.ruleType === UrlRuleToFind.ruleType &&
        index !== indexPosition
    );

    // recordAdd(checkRecords, indexPosition, true);
    // recordAdd(checkRecords, rulesFoundIndex, true);
    recordAdd(this.existingUrlRuleAtIndecIsDuplicated, indexPosition, true);
    recordAdd(this.existingUrlRuleAtIndecIsDuplicated, rulesFoundIndex, true);

    //this.existingUrlRuleAtIndecIsDuplicated.emit(checkRecords);
  }

  /**
   *
   * Double check to confirm there are no duplicates in the list of existing url rules
   */
  private checkForMoreDuplicates(): boolean {
    interface UrlRuleFormGroup {
      path?: string;
      ruleType: number;
    }
    const urlRuleChecks: boolean[] = [];
    const urlRules = this.urlMatchRuleFormArray.controls.map(group => {
      return (group as FormGroup).getRawValue() as UrlRuleFormGroup;
    });
    urlRules.forEach((urlToCheck, indexToCheck) => {
      const checkRecords = {} as Record<number, boolean>;
      urlRules.forEach((urlToCheckAgainst, indexToCheckAgainst) => {
        const foundDuplicate =
          urlToCheck.path === urlToCheckAgainst.path &&
          urlToCheck.ruleType === urlToCheckAgainst.ruleType &&
          indexToCheck !== indexToCheckAgainst;
        recordAdd(checkRecords, indexToCheckAgainst, foundDuplicate);
        recordAdd(this.existingUrlRuleAtIndecIsDuplicated, indexToCheckAgainst, foundDuplicate);
        if (foundDuplicate) {
          // this.existingUrlRuleAtIndecIsDuplicated.emit(indexToCheckAgainst);
          // this.existingUrlRuleAtIndecIsDuplicated.emit(indexToCheck);
          urlRuleChecks.push(foundDuplicate);
        }
      });
      console.log('check for duplicates');
      console.log(checkRecords);
      // this.existingUrlRuleAtIndecIsDuplicated.emit(checkRecords);
    });

    if (urlRuleChecks.length > 0) {
      return true;
    } else {
      return false;
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
