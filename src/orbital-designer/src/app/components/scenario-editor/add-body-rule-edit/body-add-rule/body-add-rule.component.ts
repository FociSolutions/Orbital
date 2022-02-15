import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AddBodyRuleBuilder } from '../add-body-rule-builder/add-body-rule.builder';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule/body-rule.type';
import { TextRuleCondition } from 'src/app/models/mock-definition/scenario/body-rule/rule-condition/text.condition';
import { JsonRuleCondition } from 'src/app/models/mock-definition/scenario/body-rule/rule-condition/json.condition';
import { defaultJsonBodyRule } from 'src/app/models/mock-definition/scenario/body-rule/rule-type/json-body-rule.model';
import { FormBodyRule } from 'src/app/models/mock-definition/scenario/body-rule/rule-type/form-body-rule.model';

@Component({
  selector: 'app-body-add-rule',
  templateUrl: './body-add-rule.component.html',
  styleUrls: ['./body-add-rule.component.scss'],
})
export class BodyAddRuleComponent implements OnInit, OnDestroy {
  /**
   * Stores the subscriptions that will be destroyed during OnDestroy
   */
  private subscriptions: Subscription[] = [];
  private bodyRuleInEdit: FormBodyRule = defaultJsonBodyRule;
  private ruleIsDuplicated = false;

  /**
   * variables for json editor
   */
  editorOptions: JsonEditorOptions;
  bodyData: unknown;

  @Input() bodyRuleAddedIsDuplicated = new EventEmitter<boolean>();
  @Output() bodyRuleAddedEventEmitter = new EventEmitter<FormBodyRule>();
  @ViewChild('editor', { static: false }) editor: JsonEditorComponent;

  readonly ruleTypes = [
    { value: BodyRuleType.JSON, display: 'JSON' },
    { value: BodyRuleType.TEXT, display: 'Text' },
  ];

  readonly textRuleConditions = [
    { value: TextRuleCondition.STARTS_WITH, display: 'Starts With' },
    { value: TextRuleCondition.ENDS_WITH, display: 'Ends With' },
    { value: TextRuleCondition.EQUALS, display: 'Equals' },
    { value: TextRuleCondition.CONTAINS, display: 'Contains' },
  ];

  readonly jsonRuleConditions = [
    { value: JsonRuleCondition.CONTAINS, display: 'Contains' },
    { value: JsonRuleCondition.EQUALITY, display: 'Equality' },
    { value: JsonRuleCondition.PATH, display: 'Path' },
    { value: JsonRuleCondition.SCHEMA, display: 'Schema' },
  ];

  bodyAddRuleFormGroup: FormGroup;

  constructor(private addBodyRuleBuilder: AddBodyRuleBuilder) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'code';
    this.editorOptions.modes = ['code', 'text'];
    this.editorOptions.onChange = () => this.changeLog();
    this.editorOptions.statusBar = true;
  }
  ngOnInit() {
    const bodyDuplicatedSubscription = this.bodyRuleAddedIsDuplicated.subscribe(
      (isDuplicated) => (this.ruleIsDuplicated = isDuplicated)
    );

    this.bodyAddRuleFormGroup = this.addBodyRuleBuilder.createNewBodyRuleForm();
    this.bodyAddRuleFormGroup.controls.rule.setValue('{}');
    this.bodyRuleInEdit.rule = this.bodyAddRuleFormGroup.controls.rule.value;
    this.bodyRuleInEdit.ruleType = this.bodyAddRuleFormGroup.controls.ruleType.value;
    this.bodyRuleInEdit.ruleCondition = this.bodyAddRuleFormGroup.controls.ruleCondition.value;

    this.checkBody();

    const ruleSubscription = this.bodyAddRuleFormGroup.get('rule').valueChanges.subscribe((rule) => {
      this.ruleIsDuplicated = false;
      this.bodyRuleInEdit.rule = rule;
    });

    const typeSubscription = this.bodyAddRuleFormGroup.get('ruleType').valueChanges.subscribe((ruleType) => {
      this.ruleIsDuplicated = false;
      this.bodyRuleInEdit.ruleType = ruleType;
    });

    const conditionSubscription = this.bodyAddRuleFormGroup
      .get('ruleCondition')
      .valueChanges.subscribe((ruleCondition) => {
        this.ruleIsDuplicated = false;
        this.bodyRuleInEdit.ruleCondition = ruleCondition;
      });

    this.subscriptions.push(ruleSubscription, typeSubscription, conditionSubscription, bodyDuplicatedSubscription);
  }

  /**
   *
   * Gets the boolean indicating if the rule to be added is duplicated.
   */
  get isRuleDuplicated(): boolean {
    return this.ruleIsDuplicated;
  }
  /**
   * Gets the form control for the 'rule'
   */
  get rule(): AbstractControl {
    return this.bodyAddRuleFormGroup.get('rule');
  }

  /**
   * Gets the form control for the 'type'
   */
  get ruleType(): AbstractControl {
    return this.bodyAddRuleFormGroup.get('ruleType');
  }

  /**
   * Gets the form control for the 'condition'
   */
  get ruleCondition(): AbstractControl {
    return this.bodyAddRuleFormGroup.get('ruleCondition');
  }

  /**
   * Controls the logic for emitting a new addBodyRule event
   */
  addBodyRule(): void {
    if (this.bodyAddRuleFormGroup.valid) {
      this.bodyRuleAddedEventEmitter.emit(this.bodyRuleInEdit);
    }
  }

  /**
   * Sets the rule object as invalid
   */
  setJsonInvalid(message: string): void {
    this.rule.setErrors({ invalidJSON: true, message });
  }

  /**
   * changelog function for json editor content
   */
  changeLog() {
    this.bodyAddRuleFormGroup.controls.rule.setValue(this.editor.getText());
  }

  /**
   * checks the initial json for errors
   */
  checkBody() {
    try {
      this.bodyData = JSON.parse(this.bodyAddRuleFormGroup.controls.rule.value);
    } catch (e) {
      this.setJsonInvalid('Invalid JSON');
      this.bodyData = '';
    }
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
