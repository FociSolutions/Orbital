import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  forwardRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  AbstractControl,
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

export interface KeyValueRuleItemFormValues {
  key: string;
  value: string;
  type: RuleType;
}

@Component({
  selector: 'app-key-value-rule-item-form',
  templateUrl: './key-value-rule-item-form.component.html',
  styleUrls: ['./key-value-rule-item-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KeyValueRuleItemFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => KeyValueRuleItemFormComponent),
      multi: true,
    },
  ],
})
export class KeyValueRuleItemFormComponent implements ControlValueAccessor, Validator, OnInit, OnChanges, OnDestroy {
  form: FormGroup;

  get key(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('key') as FormControl;
  }
  get value(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('value') as FormControl;
  }
  get type(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('type') as FormControl;
  }

  @Input() touched = false;
  @Input() readonly title = '';
  @Input() readonly errors: string[] = [];
  @Input() mode: 'add' | 'edit' = 'edit';
  @Input() readonly itemIsDuplicatedEvent = new EventEmitter<boolean>();
  @Input() readonly keyMaxLength = 200;
  @Input() readonly valueMaxLength = 3000;
  @Input() allowKeyWhitespace = false;

  @Output() addItemEvent = new EventEmitter<KeyValueRuleItemFormValues>();
  @Output() removeItemEvent = new EventEmitter<void>();
  @Output() touchedEvent = new EventEmitter<void>();

  readonly ruleTypes = [
    { value: RuleType.REGEX, label: 'Matches Regex' },
    { value: RuleType.TEXTSTARTSWITH, label: 'Starts With' },
    { value: RuleType.TEXTENDSWITH, label: 'Ends With' },
    { value: RuleType.TEXTCONTAINS, label: 'Contains' },
    { value: RuleType.TEXTEQUALS, label: 'Equals' },
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      key: [null, [Validators.required, KeyValueRuleItemFormComponent.noWhiteSpaceValidator]],
      value: [null, [Validators.required]],
      type: [null, Validators.required],
    });

    this.subscriptions.push(
      this.form.valueChanges.subscribe((value: KeyValueRuleItemFormValues | null) => {
        this.onChange.forEach((fn) => fn(value));
      }),

      this.itemIsDuplicatedEvent.subscribe((isDuplicated) => this.handleIsDuplicatedEvent(isDuplicated))
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.allowKeyWhitespace && !changes.allowKeyWhitespace.firstChange) {
      if (changes.allowKeyWhitespace.currentValue) {
        this.key.removeValidators(KeyValueRuleItemFormComponent.noWhiteSpaceValidator);
      } else {
        this.key.addValidators(KeyValueRuleItemFormComponent.noWhiteSpaceValidator);
      }
    }
    if (!changes.touched?.firstChange && changes.touched?.currentValue) {
      this.form.markAllAsTouched();
    }
  }

  touch() {
    this.onTouched.forEach((fn) => fn());
    this.touchedEvent.emit();
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

  addItem() {
    if (this.form.valid) {
      this.addItemEvent.emit(this.form.value);
    }
  }

  removeItem() {
    this.removeItemEvent.emit();
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  writeValue(value?: Partial<KeyValueRuleItemFormValues> | null): void {
    if (value === null || value === undefined) {
      this.form.reset({ value: null }, { emitEvent: false });
    } else {
      this.form.patchValue(value, { emitEvent: false });
    }
  }

  /**
   * Control validator that disallows whitespace in a string value control
   * @param control the form control
   * @returns a ValidationErrors object if the value contains whitespace, otherwise null
   */
  static noWhiteSpaceValidator(control: AbstractControl): ValidationErrors | null {
    return /\s/.test(control.value) ? { whitespace: 'Cannot contain whitespace' } : null;
  }

  static buildForm(item: Partial<KeyValueRuleItemFormValues>): FormGroup {
    // Note: this forms only needs the structure to propagate values, no functionality required
    const fb = new FormBuilder();
    return fb.group({ key: item.key ?? null, value: item.value ?? null, type: item.type ?? null });
  }

  /*
   * Boilerplate Code Below Here
   */

  validate(_: FormControl): ValidationErrors | null {
    return this.form.valid ? null : { key_value_rule_item: true };
  }

  private readonly subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  readonly onChange: Array<(value: KeyValueRuleItemFormValues) => void> = [];
  readonly onTouched: Array<() => void> = [];

  registerOnChange(fn: (value: KeyValueRuleItemFormValues) => void): void {
    this.onChange.push(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched.push(fn);
  }
}
