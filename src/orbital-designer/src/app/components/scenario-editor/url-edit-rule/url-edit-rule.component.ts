import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { ScenarioFormBuilder, ScenarioFormMapper } from '../scenario-form-builder/scenario-form.builder';
import { FormArray, FormGroup } from '@angular/forms';
import { UrlRule } from 'src/app/models/mock-definition/scenario/url-rule.model';

@Component({
  selector: 'app-url-edit-rule',
  templateUrl: './url-edit-rule.component.html',
  styleUrls: ['./url-edit-rule.component.scss'],
})
export class UrlEditRuleComponent implements OnInit, OnDestroy {
  static readonly PATH_MAXLENGTH = 3000;

  get PATH_MAXLENGTH(): number {
    return UrlEditRuleComponent.PATH_MAXLENGTH;
  }

  private subscriptions: Subscription[] = [];

  @Output() urlRuleIsDuplicated: EventEmitter<boolean>;
  @Input() urlMatchRuleFormArray: FormArray;
  constructor(private logger: NGXLogger, private formBuilder: ScenarioFormBuilder) {
    this.urlRuleIsDuplicated = new EventEmitter<boolean>();
    this.urlRuleIsDuplicated.emit(false);
  }

  ngOnInit(): void {
    const urlMatchRuleFormArraySubscription = this.urlMatchRuleFormArray.valueChanges.subscribe(() => {
      this.logger.debug('UrlEditRuleComponent checking for duplicate rules : ', this.urlMatchRuleFormArray);
      this.checkForDuplicates();
    });
    this.subscriptions.push(urlMatchRuleFormArraySubscription);
  }

  /**
   * This method listens to the event emitter from the child component and adds the KeyValue pair into the list
   * @param urlRule The key-value pair to add
   */
  addUrlEditRuleHandler(urlRule: UrlRule) {
    const ruleFound = this.isUrlRuleDuplicate(urlRule);
    if (!ruleFound) {
      this.urlRuleIsDuplicated.emit(false);
      const index = this.urlMatchRuleFormArray.length;
      const newUrlRuleControl = this.formBuilder.getUrlItemFormGroup(urlRule);
      this.urlMatchRuleFormArray.insert(index, newUrlRuleControl);
      this.logger.debug('UrlEditRuleComponent new rule added : ', urlRule);
    } else {
      this.urlRuleIsDuplicated.emit(true);
    }
  }

  /**
   * This method listens to the event emitter from the child component and deletes the KeyValue pair from the list
   * @param indexPosition The zero-based index position of the item to remove from the list
   */
  deleteUrlEditRuleHandler(indexPosition: number) {
    this.urlMatchRuleFormArray.removeAt(indexPosition);
    this.logger.debug('Delete Path Rule from url list at index: ', indexPosition);
  }

  /**
   * checks if the key-value-pair-rule is inside the current form array
   *
   */
  private isUrlRuleDuplicate(urlRule: UrlRule): boolean {
    return new ScenarioFormMapper()
      .GetUrlRulesFromForm(this.urlMatchRuleFormArray)
      .some((r) => r.path === urlRule.path && r.type === urlRule.type);
  }

  /**
   *
   * Double check to confirm there are no duplicates in the list of existing url rules
   */
  private checkForDuplicates(): void {
    this.urlMatchRuleFormArray.controls.forEach((c) => c.setErrors(null));
    this.urlMatchRuleFormArray.markAsUntouched();
    interface UrlRuleFormGroup {
      path: string;
      type: number;
    }
    const urlRules = this.urlMatchRuleFormArray.controls.map(
      (group: FormGroup): UrlRuleFormGroup => group.getRawValue()
    );
    urlRules.forEach((urlToCheck, indexToCheck) => {
      urlRules.forEach((urlToCheckAgainst, indexToCheckAgainst) => {
        const foundDuplicate =
          urlToCheck.path === urlToCheckAgainst.path &&
          urlToCheck.type === urlToCheckAgainst.type &&
          indexToCheck !== indexToCheckAgainst;
        if (foundDuplicate) {
          this.urlMatchRuleFormArray.at(indexToCheck).get('path').markAsTouched();
          this.urlMatchRuleFormArray.at(indexToCheck).get('type').markAsTouched();
          this.urlMatchRuleFormArray.at(indexToCheckAgainst).get('path').markAsTouched();
          this.urlMatchRuleFormArray.at(indexToCheckAgainst).get('type').markAsTouched();
          this.urlMatchRuleFormArray.at(indexToCheckAgainst).setErrors({ duplicated: true });
          this.urlMatchRuleFormArray.at(indexToCheck).setErrors({ duplicated: true });
        }
      });
    });
  }
  /**
   * Implementation for NG On Destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
