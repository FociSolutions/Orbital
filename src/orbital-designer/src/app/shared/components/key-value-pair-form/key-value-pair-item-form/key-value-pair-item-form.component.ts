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

export interface KeyValuePairItemFormValues {
  key: string;
  value: string;
}

@Component({
  selector: 'app-key-value-pair-item-form',
  templateUrl: './key-value-pair-item-form.component.html',
  styleUrls: ['./key-value-pair-item-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KeyValuePairItemFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => KeyValuePairItemFormComponent),
      multi: true,
    },
  ],
})
export class KeyValuePairItemFormComponent implements ControlValueAccessor, Validator, OnInit, OnChanges, OnDestroy {
  form: FormGroup = this.formBuilder.group({});

  get key(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('key') as FormControl;
  }
  get value(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('value') as FormControl;
  }

  @Input() touched = false;
  @Input() readonly title = '';
  @Input() readonly errors: string[] = [];
  @Input() readonly mode: 'add' | 'edit' = 'edit';
  @Input() readonly itemIsDuplicatedEvent = new EventEmitter<boolean>();

  @Output() readonly addItemEvent = new EventEmitter<KeyValuePairItemFormValues>();
  @Output() readonly removeItemEvent = new EventEmitter<void>();
  @Output() touchedEvent = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      key: [null, Validators.required],
      value: [null, Validators.required],
    });

    this.subscriptions.push(
      this.form.valueChanges.subscribe((value: KeyValuePairItemFormValues | null) => {
        this.onChange.forEach((fn) => fn(value));
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

  handleIsDuplicatedEvent(isDuplicated: boolean) {
    if (isDuplicated !== this.form.hasError('duplicate')) {
      if (isDuplicated) {
        this.form.setErrors({
          ...(this.form.errors ?? {}),
          duplicate: 'This item already exists. Duplicates are not allowed.',
        });
      } else {
        const { duplicate: _, ...errors } = this.form.errors ?? {};
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

  writeValue(value?: Partial<KeyValuePairItemFormValues> | null): void {
    if (value === null || value === undefined) {
      this.form.reset({ value: null }, { emitEvent: false });
    } else {
      this.form.patchValue(value, { emitEvent: false });
    }
  }

  static buildForm(item: Partial<KeyValuePairItemFormValues>): FormGroup {
    // Note: this form only needs the structure to propagate values, no functionality required
    const fb = new FormBuilder();
    return fb.group({ key: item.key ?? null, value: item.value ?? null });
  }

  /*
   * Boilerplate Code Below Here
   */

  validate(_: FormControl): ValidationErrors | null {
    return this.form.valid ? null : { key_value_pair_item: true };
  }

  private subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  readonly onChange: Array<(value: KeyValuePairItemFormValues | null) => void> = [];
  readonly onTouched: Array<() => void> = [];

  registerOnChange(fn: (value: KeyValuePairItemFormValues | null) => void): void {
    this.onChange.push(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched.push(fn);
  }
}
