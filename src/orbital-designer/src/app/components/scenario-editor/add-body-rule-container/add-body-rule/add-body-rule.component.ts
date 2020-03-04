import { Component, OnInit, Input, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { BodyRule, defaultBodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import * as deepEqual from 'deep-equal';
import { EventEmitter } from '@angular/core';
import { ValidJsonService } from '../../../../services/valid-json/valid-json.service';
import { AddBodyRuleBuilder } from './add-body-rule-builder/add-body-rule.builder';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-body-rule',
  templateUrl: './add-body-rule.component.html',
  styleUrls: ['./add-body-rule.component.scss']
})
export class AddBodyRuleComponent implements OnInit {
  isValid = true;
  errorMessage = '';
  bodyRuleTypeValues = RuleType;
  @Input() bodyRules: BodyRule[] = [];
  @Output() bodyRuleOutput: EventEmitter<BodyRule> = new EventEmitter<
    BodyRule
  >();
  addBodyRuleFormGroup: FormGroup;

  constructor(
    private logger: NGXLogger,
    private formBuilder: AddBodyRuleBuilder
  ) {}

  ngOnInit() {
    this.addBodyRuleFormGroup = this.formBuilder.createNewBodyRuleForm();
  }

  /**
   * Adds the body rule from the form field into the internal array
   */
  addBodyRule() {
    if (this.addBodyRuleFormGroup.valid && !this.bodyRuleDeepEquals()) {
      const bodyRule = this.addBodyRuleFormGroup.value as BodyRule;

      this.logger.debug('AddBodyRule: emitted body rule ', bodyRule);
      this.isValid = true;
      this.bodyRuleOutput.emit(bodyRule);
    } else {
      this.isValid = false;
    }
  }

  /**
   * Determines if the current body rule and value are object equivalent to the ones already added
   */
  private bodyRuleDeepEquals(): BodyRule {
    return this.bodyRules.find(
      ({ rule, type }) =>
        deepEqual(rule, JSON.parse(this.addBodyRuleFormGroup.controls.bodyValue.value)) &&
        deepEqual(type, this.addBodyRuleFormGroup.controls.bodyType.value)
    );
  }


}
