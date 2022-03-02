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

export interface UrlRuleItemFormValues {
  type: RuleType;
  path: string;
}

@Component({
  selector: 'app-url-rule-item-form',
  templateUrl: './url-rule-item-form.component.html',
  styleUrls: ['./url-rule-item-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UrlRuleItemFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UrlRuleItemFormComponent),
      multi: true,
    },
  ],
})
export class UrlRuleItemFormComponent implements ControlValueAccessor, Validator, OnInit, OnChanges, OnDestroy {
  form: FormGroup;

  get type(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('type') as FormControl;
  }

  get path(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('path') as FormControl;
  }

  @Input() touched = false;
  @Input() readonly title = '';
  @Input() readonly errors: string[] = [];
  @Input() readonly mode: 'add' | 'edit' = 'edit';
  @Input() readonly itemIsDuplicatedEvent = new EventEmitter<boolean>();
  @Input() readonly pathMaxLength = 3000;

  @Output() readonly addItemEvent = new EventEmitter<UrlRuleItemFormValues>();
  @Output() readonly removeItemEvent = new EventEmitter<void>();
  @Output() touchedEvent = new EventEmitter<void>();

  readonly ruleTypes = [
    { value: RuleType.ACCEPTALL, label: 'Accept All' },
    { value: RuleType.REGEX, label: 'Matches Regex' },
    { value: RuleType.TEXTEQUALS, label: 'Equals' },
  ];
  RuleType = RuleType;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      type: [null, Validators.required],
      path: [{ value: null, disabled: true }, Validators.required],
    });

    this.subscriptions.push(
      this.form.valueChanges.subscribe((value: UrlRuleItemFormValues | null) => {
        const adjustedValue = this.adjustFormValue(value);
        this.onChange.forEach((fn) => fn(adjustedValue));
        // Must be after the callbacks since it triggers another event on this observable
        if (value) {
          this.handleDisablingPathField(value.type);
        }
      }),

      this.itemIsDuplicatedEvent.subscribe((isDuplicated) => this.handleIsDuplicatedEvent(isDuplicated))
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.touched?.firstChange && changes.touched?.currentValue) {
      this.form.markAllAsTouched();
    }
  }

  touch() {
    this.onTouched.forEach((fn) => fn());
    this.touchedEvent.emit();
  }

  adjustFormValue(value: UrlRuleItemFormValues | null): UrlRuleItemFormValues | null {
    if (!value) {
      return null;
    }
    const newValue = { ...value };
    if (!value.path || value?.type === RuleType.ACCEPTALL) {
      newValue.path = '';
    }
    return newValue;
  }

  handleDisablingPathField(type: RuleType | null) {
    if (!type || type === RuleType.ACCEPTALL) {
      if (this.path.enabled) {
        this.path.disable();
      }
    } else {
      if (this.path.disabled) {
        this.path.enable({ emitEvent: false });
        this.path.setValue(this.path.value);
      }
    }
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
      this.addItemEvent.emit(this.adjustFormValue(this.form.value));
    }
  }

  removeItem() {
    this.removeItemEvent.emit();
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  writeValue(value?: Partial<UrlRuleItemFormValues> | null): void {
    if (value === null || value === undefined) {
      this.form.reset({ value: null }, { emitEvent: false });
      this.path.disable({ emitEvent: false });
    } else {
      this.form.patchValue(value);
    }
  }

  static buildForm(item: Partial<UrlRuleItemFormValues>): FormGroup {
    // Note: this forms only needs the structure to propagate values, no functionality required
    const fb = new FormBuilder();
    return fb.group({ type: item.type ?? null, path: item.path ?? null });
  }

  /*
   * Boilerplate Code Below Here
   */

  validate(_: FormControl): ValidationErrors | null {
    return this.form.valid ? null : { url_rule_item: true };
  }

  private subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  readonly onChange: Array<(value: UrlRuleItemFormValues) => void> = [];
  readonly onTouched: Array<() => void> = [];

  registerOnChange(fn: (value: UrlRuleItemFormValues) => void): void {
    this.onChange.push(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched.push(fn);
  }
}
