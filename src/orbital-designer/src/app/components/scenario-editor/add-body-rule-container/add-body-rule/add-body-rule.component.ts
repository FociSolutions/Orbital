import { Component, OnInit, Input, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import * as deepEqual from 'deep-equal';
import { EventEmitter } from '@angular/core';
import { AddBodyRuleBuilder } from './add-body-rule-builder/add-body-rule.builder';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-body-rule',
  templateUrl: './add-body-rule.component.html',
  styleUrls: ['./add-body-rule.component.scss']
})
export class AddBodyRuleComponent implements OnInit {
  errorMessage = '';
  bodyRuleTypeValues = RuleType;
  @Input() bodyRules: BodyRule[] = [];
  @Output() bodyRuleOutput: EventEmitter<BodyRule> = new EventEmitter<BodyRule>();
  addBodyRuleFormGroup: FormGroup;

  constructor(private logger: NGXLogger, private formBuilder: AddBodyRuleBuilder) {}

  ngOnInit() {
    this.addBodyRuleFormGroup = this.formBuilder.createNewBodyRuleForm();

    // change validators depending on if the JSON path or any JSON match is selected
    this.addBodyRuleFormGroup.controls.type.valueChanges.subscribe(newType => {
      this.addBodyRuleFormGroup.controls.rule.clearValidators();
      if (newType === RuleType.JSONPATH) {
        this.addBodyRuleFormGroup.controls.rule.setValidators([this.formBuilder.validateJsonPath.bind(this)]);
      } else {
        this.addBodyRuleFormGroup.controls.rule.setValidators([this.formBuilder.validateJson.bind(this)]);
      }
    });
  }

  /**
   * Adds the body rule from the form field into the internal array
   */
  addBodyRule() {
    this.errorMessage = '';
    if (this.addBodyRuleFormGroup.valid && !this.bodyRuleDeepEquals()) {
      const bodyRule = {
        rule:
          this.addBodyRuleFormGroup.controls.type.value === RuleType.JSONPATH
            ? this.addBodyRuleFormGroup.controls.rule.value
            : JSON.parse(this.addBodyRuleFormGroup.controls.rule.value),
        type: this.addBodyRuleFormGroup.controls.type.value
      };

      this.logger.debug('AddBodyRule: emitted body rule ', bodyRule);
      this.bodyRuleOutput.emit(bodyRule);
    } else if (!this.addBodyRuleFormGroup.valid) {
      this.errorMessage = 'The body rule must be valid JSON or a string literal';
    } else if (this.bodyRuleDeepEquals()) {
      this.errorMessage = 'The body rule already exists';
    }
  }

  /**
   * Determines if the current body rule and value are object equivalent to the ones already added
   */
  private bodyRuleDeepEquals(): BodyRule {
    return this.bodyRules.find(
      ({ rule, type }) =>
        deepEqual(
          rule,
          this.addBodyRuleFormGroup.controls.type.value === RuleType.JSONPATH
            ? this.addBodyRuleFormGroup.controls.rule.value
            : JSON.parse(this.addBodyRuleFormGroup.controls.rule.value)
        ) && deepEqual(type, this.addBodyRuleFormGroup.controls.type.value)
    );
  }
}
