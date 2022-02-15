import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { FormArray, FormGroup } from '@angular/forms';
import { AddBodyRuleBuilder } from './add-body-rule-builder/add-body-rule.builder';
import { ValidJsonService } from 'src/app/services/valid-json/valid-json.service';
import { FormBodyRule } from 'src/app/models/mock-definition/scenario/body-rule/rule-type/form-body-rule.model';

@Component({
  selector: 'app-body-edit-rule',
  templateUrl: './body-edit-rule.component.html',
  styleUrls: ['./body-edit-rule.component.scss'],
})
export class BodyEditRuleComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  addingNewBodyRule: boolean;
  bodyRuleFormIsEmpty: boolean;

  @Output() bodyRuleIsDuplicated: EventEmitter<boolean>;
  @Input() bodyMatchRuleFormArray: FormArray;
  constructor(
    private logger: NGXLogger,
    private formBuilder: AddBodyRuleBuilder,
    private validJsonService: ValidJsonService
  ) {
    this.bodyRuleIsDuplicated = new EventEmitter<boolean>();
    this.bodyRuleIsDuplicated.emit(false);
    this.addingNewBodyRule = false;
    this.bodyRuleFormIsEmpty = true;
  }

  ngOnInit(): void {
    const bodyMatchRuleFormArraySubscription = this.bodyMatchRuleFormArray.valueChanges.subscribe(() => {
      this.logger.debug('BodyEditRuleComponent checking for duplicate rules : ', this.bodyMatchRuleFormArray);
      this.checkForDuplicates();
    });
    this.subscriptions.push(bodyMatchRuleFormArraySubscription);
    this.bodyRuleFormIsEmpty = !this.bodyMatchRuleFormArray.controls.length;
  }

  /**
   * Adds an empty @param bodyRule to the body rule list container for the user
   * to edit and save into the list
   */
  addEmptyBodyRule() {
    this.addingNewBodyRule = true;
    this.bodyRuleFormIsEmpty = false;
  }

  /**
   * This method listens to the event emitter from the child component and adds the body rule into the list
   * @param bodyRule The body rule being taken in from the child component to be added
   */
  addBodyEditRuleHandler(bodyRule: FormBodyRule) {
    const ruleFound = this.isBodyRuleDuplicate(bodyRule);
    if (!ruleFound && this.bodyMatchRuleFormArray.valid) {
      this.bodyRuleIsDuplicated.emit(false);
      const index = this.bodyMatchRuleFormArray.length;
      const newBodyRuleControl = this.formBuilder.createBodyRuleForm(bodyRule);
      this.bodyMatchRuleFormArray.insert(index, newBodyRuleControl);

      this.addingNewBodyRule = false;
      this.bodyRuleFormIsEmpty = false;
      this.logger.debug('BodyEditRuleComponent new rule added : ', bodyRule);
    } else {
      this.bodyRuleIsDuplicated.emit(true);
      this.addingNewBodyRule = false;
      this.bodyRuleFormIsEmpty = true;
    }
  }

  /**
   * This method listens to the event emitter from the child component and deletes the body rule from the list
   * @param indexPosition The body rule being taken in from the child component to be deleted
   */
  deleteBodyEditRuleHandler(indexPosition: number) {
    this.bodyMatchRuleFormArray.removeAt(indexPosition);
    this.logger.debug('Delete rule Rule from body list at index: ', indexPosition);
  }

  /**
   * Checks if the body rule is inside the current form array
   * @param bodyRuleToAdd the body rule to check against the existing list
   */
  private isBodyRuleDuplicate(bodyRuleToAdd: FormBodyRule): boolean {
    return this.bodyMatchRuleFormArray.controls
      .map((group: FormGroup): FormBodyRule => {
        return group.getRawValue();
      })
      .some((bodyFormGroup) => {
        return (
          (typeof bodyFormGroup.rule === 'object' ? JSON.stringify(bodyFormGroup.rule) : bodyFormGroup.rule) ===
            (typeof bodyRuleToAdd.rule === 'object' ? JSON.stringify(bodyRuleToAdd.rule) : bodyRuleToAdd.rule) &&
          bodyFormGroup.ruleType === bodyRuleToAdd.ruleType &&
          bodyFormGroup.ruleCondition === bodyRuleToAdd.ruleCondition
        );
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
      rule: string;
      ruleType: number;
      ruleCondition: number;
    }
    const bodyRules = this.bodyMatchRuleFormArray.controls.map((group): BodyRuleFormGroup => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      return (group as FormGroup).getRawValue();
    });
    bodyRules.forEach((bodyToCheck, indexToCheck) => {
      bodyRules.forEach((bodyToCheckAgainst, indexToCheckAgainst) => {
        const foundDuplicate =
          bodyToCheck.rule === bodyToCheckAgainst.rule &&
          bodyToCheck.ruleType === bodyToCheckAgainst.ruleType &&
          bodyToCheck.ruleCondition === bodyToCheckAgainst.ruleCondition &&
          indexToCheck !== indexToCheckAgainst;
        if (foundDuplicate) {
          this.bodyMatchRuleFormArray.at(indexToCheck).get('rule').markAsTouched();
          this.bodyMatchRuleFormArray.at(indexToCheck).get('ruleType').markAsTouched();
          this.bodyMatchRuleFormArray.at(indexToCheck).get('ruleCondition').markAsTouched();
          this.bodyMatchRuleFormArray.at(indexToCheckAgainst).get('rule').markAsTouched();
          this.bodyMatchRuleFormArray.at(indexToCheckAgainst).get('ruleType').markAsTouched();
          this.bodyMatchRuleFormArray.at(indexToCheckAgainst).get('ruleCondition').markAsTouched();
          this.bodyMatchRuleFormArray.setErrors({ duplicated: true });
        }
      });
    });
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
