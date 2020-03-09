import { Component, OnInit, Input, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import * as deepEqual from 'deep-equal';
import { EventEmitter, ViewChild } from '@angular/core';
import { AddBodyRuleBuilder } from '../../add-body-rule-edit/add-body-rule-builder/add-body-rule.builder';
import { FormGroup, NgForm } from '@angular/forms';
import { ValidJsonService } from 'src/app/services/valid-json/valid-json.service';

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
  @ViewChild('addBodyRuleFormDirective', { static: false })
  public addBodyRuleFormDirective: NgForm;

  constructor(
    private logger: NGXLogger,
    private formBuilder: AddBodyRuleBuilder,
    private validJsonService: ValidJsonService
  ) {}

  ngOnInit() {
    this.addBodyRuleFormGroup = this.formBuilder.createNewBodyRuleForm();
  }

  /**
   * Adds the body rule from the form field into the internal array
   */
  addBodyRule() {
    this.errorMessage = '';
    if (this.addBodyRuleFormGroup.valid && !this.bodyRuleDeepEquals()) {
      const bodyRule = {
        rule: JSON.parse(this.addBodyRuleFormGroup.controls.rule.value),
        type: this.addBodyRuleFormGroup.controls.type.value
      };

      this.logger.debug('AddBodyRule: emitted body rule ', bodyRule);
      this.bodyRuleOutput.emit(bodyRule);

      // clear the form and validators state (so it does not show invalid after adding a rule)
      // setTimeout is required as it has to run async
      setTimeout(() => {
        this.addBodyRuleFormDirective.resetForm();
        this.addBodyRuleFormGroup.reset();
      });
    } else if (!this.addBodyRuleFormGroup.valid) {
      this.errorMessage = 'The JSON rule or path is invalid';
    } else if (this.bodyRuleDeepEquals()) {
      this.errorMessage = 'The body rule already exists';
    }
  }

  /**
   * Determines if the current body rule and value are object equivalent to the ones already added
   */
  private bodyRuleDeepEquals(): BodyRule {
    return this.bodyRules.find(({ rule, type }) => {
      const ruleParsed = this.validJsonService.parseJSONOrDefault(this.addBodyRuleFormGroup.controls.rule.value, null);
      return (
        ruleParsed !== null &&
        deepEqual(rule, ruleParsed) &&
        deepEqual(type, this.addBodyRuleFormGroup.controls.type.value)
      );
    });
  }
}
