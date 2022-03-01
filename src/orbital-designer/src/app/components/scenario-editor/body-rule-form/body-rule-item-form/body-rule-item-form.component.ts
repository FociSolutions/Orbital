import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, forwardRef } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule-type';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { ValidJsonService } from 'src/app/services/valid-json/valid-json.service';
import {
  BodyRuleType,
  InternalBodyRuleItemFormValues,
  InternalRuleType,
  JsonRuleCondition,
  TextRuleCondition,
} from './body-rule-item-form.types';

export interface BodyRuleItemFormValues {
  type: RuleType;
  value: string;
}

@Component({
  selector: 'app-body-rule-item-form',
  templateUrl: './body-rule-item-form.component.html',
  styleUrls: ['./body-rule-item-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BodyRuleItemFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BodyRuleItemFormComponent),
      multi: true,
    },
  ],
})
export class BodyRuleItemFormComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy {
  form: FormGroup;

  get ruleType(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('ruleType') as FormControl;
  }

  get ruleCondition(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('ruleCondition') as FormControl;
  }

  get value(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('value') as FormControl;
  }

  @Output() readonly addItemEvent = new EventEmitter<BodyRuleItemFormValues>();
  @Output() readonly removeItemEvent = new EventEmitter<void>();

  @Input() readonly title = '';
  @Input() readonly errors: string[] = [];
  @Input() mode: 'add' | 'edit' | 'view' = 'view';
  @Input() readonly itemIsDuplicatedEvent = new EventEmitter<boolean>();
  @Input() readonly pathMaxLength = 3000;

  readonly ruleTypes = [
    { value: BodyRuleType.TEXT, label: 'Text' },
    { value: BodyRuleType.JSON, label: 'JSON' },
  ];
  BodyRuleType = BodyRuleType;

  readonly textRuleConditions = [
    { value: TextRuleCondition.STARTS_WITH, label: 'Starts With' },
    { value: TextRuleCondition.ENDS_WITH, label: 'Ends With' },
    { value: TextRuleCondition.EQUALS, label: 'Equals' },
    { value: TextRuleCondition.CONTAINS, label: 'Contains' },
  ];

  readonly jsonRuleConditions = [
    { value: JsonRuleCondition.CONTAINS, label: 'Contains' },
    { value: JsonRuleCondition.EQUALITY, label: 'Equality' },
    { value: JsonRuleCondition.PATH, label: 'Path' },
    { value: JsonRuleCondition.SCHEMA, label: 'Schema' },
  ];

  currentMatchConditions: { value: number; label: string }[] = [];

  valueEditorOptions = new JsonEditorOptions();
  initValueData = {};
  valueDataWasFocused = false;
  @ViewChild(JsonEditorComponent, { static: false }) valueEditor: JsonEditorComponent;

  defaults: InternalBodyRuleItemFormValues = {
    ruleType: null,
    ruleCondition: null,
    value: '{}',
  };

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      ruleType: [this.defaults.ruleType, Validators.required],
      ruleCondition: [{ value: this.defaults.ruleCondition, disabled: true }, Validators.required],
      value: [this.defaults.value, Validators.required],
    });

    this.subscriptions.push(
      this.form.valueChanges.subscribe((value: InternalBodyRuleItemFormValues | null) => {
        this.onChange.forEach((fn) => fn(this.adaptInternalFormatToExternal(value)));
        this.onTouched.forEach((fn) => fn());
      }),

      this.ruleType.valueChanges.subscribe((value: BodyRuleType | null) => {
        this.setCurrentMatchConditions(value);
        this.handleValueSetupForType(value);
      }),

      this.itemIsDuplicatedEvent.subscribe((isDuplicated) => this.handleIsDuplicatedEvent(isDuplicated))
    );

    this.valueEditorOptions.mode = 'code';
    this.valueEditorOptions.modes = ['code', 'text'];
    this.valueEditorOptions.statusBar = true;
    this.valueEditorOptions.onFocus = () => (this.valueDataWasFocused = true);
    this.valueEditorOptions.onBlur = () => this.valueDataWasFocused && this.value.markAsTouched();
    this.valueEditorOptions.onChangeText = (jsonString: string) => {
      this.value.markAsDirty();
      this.value.setValue(jsonString);
    };
  }

  adaptInternalFormatToExternal(values: InternalBodyRuleItemFormValues | null): BodyRuleItemFormValues | null {
    return !values ? null : { type: this.getExternalRuleType(values), value: values.value };
  }

  adaptExternalFormatToInternal(
    values: Partial<BodyRuleItemFormValues> | null
  ): Partial<InternalBodyRuleItemFormValues> | null {
    return !values ? null : { ...this.getInternalRuleType(values.type), value: values.value };
  }

  handleIsDuplicatedEvent(isDuplicated: boolean) {
    if (isDuplicated !== this.form.hasError('duplicate')) {
      if (isDuplicated) {
        this.form.setErrors({
          ...(this.form.errors ?? {}),
          duplicate: 'This item already exists. Duplicates are not allowed.',
        });
      } else {
        const { duplicate: _, ...errors } = this.form.errors;
        this.form.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
  }

  handleValueSetupForType(bodyRuleType: BodyRuleType | null) {
    switch (bodyRuleType) {
      case BodyRuleType.TEXT:
        this.value.clearValidators();
        this.value.addValidators(Validators.required);
        this.value.updateValueAndValidity({ emitEvent: false });
        break;
      case BodyRuleType.JSON: {
        this.value.clearValidators();
        this.value.addValidators(ValidJsonService.getValidator());
        const jsonValue = this.safeParseJson(this.value.value ?? this.defaults.value);
        this.initValueData = jsonValue;
        this.value.setValue(JSON.stringify(jsonValue), { emitEvent: false });
        this.value.updateValueAndValidity({ emitEvent: false });
        break;
      }
      case null:
        break;
      default: {
        const _: never = bodyRuleType;
      }
    }
  }

  setCurrentMatchConditions(value: BodyRuleType | null) {
    const conditionsPreChange = this.currentMatchConditions;
    switch (value) {
      case BodyRuleType.TEXT:
        this.currentMatchConditions = this.textRuleConditions;
        break;
      case BodyRuleType.JSON:
        this.currentMatchConditions = this.jsonRuleConditions;
        break;
      case null:
        this.currentMatchConditions = [];
        this.ruleCondition.disable({ emitEvent: false });
        break;
      default: {
        const _: never = value;
      }
    }

    if (value !== null) {
      this.ruleCondition.enable({ emitEvent: false });
    }

    if (this.currentMatchConditions !== conditionsPreChange) {
      this.ruleCondition.setValue(null, { emitEvent: false });
    }
  }

  getTypeText(type: BodyRuleType | null): string {
    return Object.values(this.ruleTypes).filter((x) => x.value === type)?.[0]?.label ?? ' ';
  }

  getConditionText(condition: TextRuleCondition | JsonRuleCondition | null): string {
    const ruleType: BodyRuleType = this.ruleType.value;
    switch (ruleType) {
      case BodyRuleType.TEXT:
        return Object.values(this.textRuleConditions).filter((x) => x.value === condition)?.[0]?.label ?? ' ';
      case BodyRuleType.JSON:
        return Object.values(this.jsonRuleConditions).filter((x) => x.value === condition)?.[0]?.label ?? ' ';
      default: {
        const _: never = ruleType;
        return ' ';
      }
    }
  }

  addItem() {
    if (this.form.valid) {
      this.addItemEvent.emit(this.form.value);
    }
  }

  saveItem() {
    this.mode = 'view';
    this.initValueData = this.safeParseJson(this.value.value ?? this.defaults.value);
  }

  editItem() {
    this.mode = 'edit';
  }

  removeItem() {
    this.removeItemEvent.emit();
  }

  validate(_: FormControl): ValidationErrors | null {
    return this.form.valid ? null : { body_rule_item: true };
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  writeValue(value?: Partial<BodyRuleItemFormValues> | null): void {
    if (value === null || value === undefined) {
      this.form.reset(this.defaults, { emitEvent: false });
    } else {
      const int_value = this.adaptExternalFormatToInternal(value);
      this.setCurrentMatchConditions(int_value.ruleType);
      this.handleValueSetupForType(int_value.ruleType);
      this.form.patchValue(int_value, { emitEvent: false });
    }
    this.initValueData = this.safeParseJson(this.value.value ?? this.defaults.value);
    this.onValidationChange.forEach((fn) => fn());
  }

  safeParseJson(json: string): object {
    try {
      return JSON.parse(json);
    } catch (e) {
      return {};
    }
  }

  static buildForm(item: Partial<BodyRuleItemFormValues>): FormGroup {
    // Note: this form only needs the structure to propagate values, no functionality required
    const fb = new FormBuilder();
    const schema: BodyRuleItemFormValues = {
      type: item.type ?? null,
      value: item.value ?? null,
    };
    return fb.group(schema);
  }

  getExternalRuleType(rule: Partial<InternalBodyRuleItemFormValues> | null): RuleType {
    switch (rule?.ruleType) {
      case BodyRuleType.TEXT:
        switch (rule?.ruleCondition) {
          case TextRuleCondition.CONTAINS:
            return RuleType.TEXTCONTAINS;
          case TextRuleCondition.EQUALS:
            return RuleType.TEXTEQUALS;
          case TextRuleCondition.STARTS_WITH:
            return RuleType.TEXTSTARTSWITH;
          case TextRuleCondition.ENDS_WITH:
            return RuleType.TEXTENDSWITH;
          default: {
            const _: never = rule;
          }
        }
        break;
      case BodyRuleType.JSON:
        switch (rule?.ruleCondition) {
          case JsonRuleCondition.CONTAINS:
            return RuleType.JSONCONTAINS;
          case JsonRuleCondition.EQUALITY:
            return RuleType.JSONEQUALITY;
          case JsonRuleCondition.PATH:
            return RuleType.JSONPATH;
          case JsonRuleCondition.SCHEMA:
            return RuleType.JSONSCHEMA;
          default: {
            const _: never = rule;
          }
        }
        break;
      default: {
        const _: never = rule;
      }
    }
    return null;
  }

  getInternalRuleType(type: RuleType): InternalRuleType {
    switch (type) {
      case RuleType.NONE:
      case RuleType.REGEX:
      case RuleType.ACCEPTALL:
      case RuleType.JSONCONTAINS:
        return { ruleType: BodyRuleType.JSON, ruleCondition: JsonRuleCondition.CONTAINS };
      case RuleType.JSONEQUALITY:
        return { ruleType: BodyRuleType.JSON, ruleCondition: JsonRuleCondition.EQUALITY };
      case RuleType.JSONPATH:
        return { ruleType: BodyRuleType.JSON, ruleCondition: JsonRuleCondition.PATH };
      case RuleType.JSONSCHEMA:
        return { ruleType: BodyRuleType.JSON, ruleCondition: JsonRuleCondition.SCHEMA };
      case RuleType.TEXTCONTAINS:
        return { ruleType: BodyRuleType.TEXT, ruleCondition: TextRuleCondition.CONTAINS };
      case RuleType.TEXTEQUALS:
        return { ruleType: BodyRuleType.TEXT, ruleCondition: TextRuleCondition.EQUALS };
      case RuleType.TEXTSTARTSWITH:
        return { ruleType: BodyRuleType.TEXT, ruleCondition: TextRuleCondition.STARTS_WITH };
      case RuleType.TEXTENDSWITH:
        return { ruleType: BodyRuleType.TEXT, ruleCondition: TextRuleCondition.ENDS_WITH };
      default: {
        const _: never = type;
      }
    }
  }

  /*
   * Boilerplate Code Below Here
   */

  private readonly subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  readonly onChange: Array<(value: BodyRuleItemFormValues) => void> = [];
  readonly onTouched: Array<() => void> = [];
  readonly onValidationChange: Array<() => void> = [];

  registerOnChange(fn: (value: BodyRuleItemFormValues) => void): void {
    this.onChange.push(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched.push(fn);
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidationChange.push(fn);
  }
}
