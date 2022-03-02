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
import { PolicyType } from 'src/app/models/mock-definition/scenario/policy-type';
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
import { DelayResponsePolicy } from 'src/app/models/mock-definition/scenario/policy.model';

export type PolicyFormValues = DelayResponsePolicy;

@Component({
  selector: 'app-policy-form',
  templateUrl: './policy-form.component.html',
  styleUrls: ['./policy-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PolicyFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PolicyFormComponent),
      multi: true,
    },
  ],
})
export class PolicyFormComponent implements ControlValueAccessor, Validator, OnInit, OnChanges, OnDestroy {
  form: FormGroup;

  get type(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('type') as FormControl;
  }
  get value(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('value') as FormControl;
  }

  @Output() addPolicyEvent = new EventEmitter<PolicyFormValues>();
  @Output() removePolicyEvent = new EventEmitter<void>();
  @Output() touchedEvent = new EventEmitter<void>();

  readonly policyTypes = [{ value: PolicyType.DELAY_RESPONSE, label: 'Delay Response' }];
  PolicyType = PolicyType;

  @Input() touched = false;
  @Input() title = '';
  @Input() errors: string[] = [];
  @Input() mode: 'add' | 'edit' = 'edit';
  @Input() policyIsDuplicatedEvent = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      type: [null, Validators.required],
      value: [null, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]],
    });

    this.subscriptions.push(
      this.form.valueChanges.subscribe((value: PolicyFormValues | null) => {
        this.onChange.forEach((fn) => fn(value));
      }),

      this.policyIsDuplicatedEvent.subscribe((isDuplicated) => {
        if (isDuplicated !== this.form.hasError('duplicate')) {
          if (isDuplicated) {
            this.form.setErrors({
              ...(this.form.errors ?? {}),
              duplicate: 'This policy (type or value) already exists. Duplicates are not allowed.',
            });
          } else {
            const { duplicate: _, ...errors } = this.form.errors;
            this.form.setErrors(Object.keys(errors).length ? errors : null);
          }
        }
      })
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

  addPolicy() {
    if (this.form.valid) {
      this.addPolicyEvent.emit(this.form.value);
    }
  }

  removePolicy() {
    this.removePolicyEvent.emit();
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  writeValue(value?: Partial<PolicyFormValues> | null): void {
    if (value === null || value === undefined) {
      this.form.reset({ value: null }, { emitEvent: false });
    } else {
      this.form.patchValue(value, { emitEvent: false });
    }
  }

  static buildForm(policy: Partial<PolicyFormValues>): FormGroup {
    // Note: these forms only need the structure to propagate values, no functionality required
    const fb = new FormBuilder();
    switch (policy.type) {
      case PolicyType.DELAY_RESPONSE:
        return fb.group({ type: policy.type ?? null, value: policy.value ?? null });
      default: {
        // Cause a type-check error if a case is missed
        const _: never = policy.type;
        throw new Error('Invalid Policy Type');
      }
    }
  }

  /*
   * Boilerplate Code Below Here
   */

  validate(_: FormControl): ValidationErrors | null {
    return this.form.valid ? null : { policy: true };
  }

  private subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  readonly onChange: Array<(value: PolicyFormValues) => void> = [];
  readonly onTouched: Array<() => void> = [];

  registerOnChange(fn: (value: PolicyFormValues) => void): void {
    this.onChange.push(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched.push(fn);
  }
}
