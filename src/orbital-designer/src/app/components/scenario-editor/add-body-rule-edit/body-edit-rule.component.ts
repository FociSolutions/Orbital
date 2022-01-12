import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { FormArray, FormGroup } from '@angular/forms';
import { AddBodyRuleBuilder } from './add-body-rule-builder/add-body-rule.builder';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { ValidJsonService } from 'src/app/services/valid-json/valid-json.service';

@Component({
  selector: 'app-body-edit-rule',
  templateUrl: './body-edit-rule.component.html',
  styleUrls: ['./body-edit-rule.component.scss'],
})
export class BodyEditRuleComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  @Output() bodyRuleIsDuplicated: EventEmitter<boolean>;
  @Input() bodyMatchRuleFormArray: FormArray;
  constructor(
    private logger: NGXLogger,
    private formBuilder: AddBodyRuleBuilder,
    private validJsonService: ValidJsonService
  ) {
    this.bodyRuleIsDuplicated = new EventEmitter<boolean>();
    this.bodyRuleIsDuplicated.emit(false);
  }

  ngOnInit(): void {
    const bodyMatchRuleFormArraySubscription = this.bodyMatchRuleFormArray.valueChanges.subscribe(() => {
      this.logger.debug('BodyEditRuleComponent checking for duplicate rules : ', this.bodyMatchRuleFormArray);
      this.checkForDuplicates();
    });
    this.subscriptions.push(bodyMatchRuleFormArraySubscription);
  }

  /**
   * This method listens to the event emitter from the child component and adds the body rule into the list
   * @param bodyRule The body rule being taken in from the child component to be added
   */
  addBodyEditRuleHandler(bodyRule: BodyRule) {
    const ruleFound = this.isBodyRuleDuplicate(bodyRule);
    if (!ruleFound && this.bodyMatchRuleFormArray.valid) {
      this.bodyRuleIsDuplicated.emit(false);
      const index = this.bodyMatchRuleFormArray.length;
      const newBodyRuleControl = this.formBuilder.createBodyRuleForm(bodyRule);
      this.bodyMatchRuleFormArray.insert(index, newBodyRuleControl);
      this.logger.debug('BodyEditRuleComponent new rule added : ', bodyRule);
    } else {
      this.bodyRuleIsDuplicated.emit(true);
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
  private isBodyRuleDuplicate(bodyRuleToAdd: BodyRule): boolean {
    interface BodyRuleFormGroup {
      rule: string;
      type: number;
    }

    return this.bodyMatchRuleFormArray.controls
      .map((group): BodyRuleFormGroup => {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        return (group as FormGroup).getRawValue();
      })
      .some((bodyFormGroup) => {
        return (
          bodyFormGroup.rule ===
            (typeof bodyRuleToAdd.rule === 'object' ? JSON.stringify(bodyRuleToAdd.rule) : bodyRuleToAdd.rule) &&
          bodyFormGroup.type === bodyRuleToAdd.type
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
      type: RuleType;
    }
    const bodyRules = this.bodyMatchRuleFormArray.controls.map((group): BodyRuleFormGroup => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      return (group as FormGroup).getRawValue();
    });
    bodyRules.forEach((bodyToCheck, indexToCheck) => {
      bodyRules.forEach((bodyToCheckAgainst, indexToCheckAgainst) => {
        const foundDuplicate =
          bodyToCheck.rule === bodyToCheckAgainst.rule &&
          bodyToCheck.type === bodyToCheckAgainst.type &&
          indexToCheck !== indexToCheckAgainst;
        if (foundDuplicate) {
          this.bodyMatchRuleFormArray.at(indexToCheck).get('rule').markAsTouched();
          this.bodyMatchRuleFormArray.at(indexToCheck).get('type').markAsTouched();
          this.bodyMatchRuleFormArray.at(indexToCheckAgainst).get('rule').markAsTouched();
          this.bodyMatchRuleFormArray.at(indexToCheckAgainst).get('type').markAsTouched();
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
