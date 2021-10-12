import { Component, OnInit, EventEmitter, Output, OnDestroy, Input, ViewChild } from '@angular/core';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BodyRule, defaultBodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { AddBodyRuleBuilder } from '../add-body-rule-builder/add-body-rule.builder';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

@Component({
  selector: 'app-body-add-rule',
  templateUrl: './body-add-rule.component.html',
  styleUrls: ['./body-add-rule.component.scss']
})
export class BodyAddRuleComponent implements OnInit, OnDestroy {
  /**
   * Stores the subscriptions that will be destroyed during OnDestroy
   */
  private subscriptions: Subscription[] = [];
  private bodyRuleInEdit = defaultBodyRule;
  private ruleIsDuplicated = false;

  /**
   * variables for json editor
   */
  public editorOptions: JsonEditorOptions;
  public bodyData: any;

  @Input() bodyRuleAddedIsDuplicated = new EventEmitter<boolean>();
  @Output() bodyRuleAddedEventEmitter = new EventEmitter<BodyRule>();
  @ViewChild('editor', { static: false }) editor: JsonEditorComponent;

  readonly rules = [
    { value: RuleType.JSONPATH, viewValue: 'JSON: Path' },
    { value: RuleType.JSONSCHEMA, viewValue: 'JSON: Schema' },
    { value: RuleType.JSONCONTAINS, viewValue: 'JSON: Contains' },
    { value: RuleType.JSONEQUALITY, viewValue: 'JSON: Equality' },
    { value: RuleType.TEXTCONTAINS, viewValue: 'Text: Contains' },
    { value: RuleType.TEXTENDSWITH, viewValue: 'Text: Ends With' },
    { value: RuleType.TEXTEQUALS, viewValue: 'Text: Equals' },
    { value: RuleType.TEXTSTARTSWITH, viewValue: 'Text: Starts With' }
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
      isDuplicated => (this.ruleIsDuplicated = isDuplicated)
    );


    this.bodyAddRuleFormGroup = this.addBodyRuleBuilder.createNewBodyRuleForm();
    this.bodyAddRuleFormGroup.controls.rule.setValue('');
    this.bodyRuleInEdit.rule = this.bodyAddRuleFormGroup.controls.rule.value;
    this.bodyRuleInEdit.type = this.bodyAddRuleFormGroup.controls.type.value;

    this.checkBody();

    const ruleSubscription = this.bodyAddRuleFormGroup.get('rule').valueChanges.subscribe(rule => {
      this.ruleIsDuplicated = false;
      this.bodyRuleInEdit.rule = rule;
    });

    const typeSubscription = this.bodyAddRuleFormGroup.get('type').valueChanges.subscribe(type => {
      this.ruleIsDuplicated = false;
      this.bodyRuleInEdit.type = type;
    });

    this.subscriptions.push(ruleSubscription, typeSubscription, bodyDuplicatedSubscription);
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
  get type(): AbstractControl {
    return this.bodyAddRuleFormGroup.get('type');
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
  setJsonInvalid(): void {
    this.rule.setErrors({ invalidJson: true, message: 'The JSON is invalid' });
  }

  /**
   * changelog function for json editor content
   */
  changeLog() {
    try {
      if (this.editor.isValidJson()) {
        const jsonContent = this.editor.get();
        if (Object.keys(jsonContent).length === 0) {
          this.setJsonInvalid;
          console.log(this.rule.status);
        }
        else {
          const newData = JSON.stringify(jsonContent);
          this.bodyAddRuleFormGroup.controls.rule.setValue(newData);
        }
      }
      else {
        this.setJsonInvalid;
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * checks the initial json for errors
   */
  checkBody() {
    try {
      this.bodyData = JSON.parse(this.bodyAddRuleFormGroup.controls.rule.value);
    } catch (e) {
      this.setJsonInvalid;
      this.bodyData = '';
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
