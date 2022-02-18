import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { PolicyFormComponent, PolicyFormValues } from './policy-form/policy-form.component';
import { PolicyType } from 'src/app/models/mock-definition/scenario/policy-type';

export type PoliciesFormValues = PolicyFormValues[];
type PartialPoliciesFormValues = Partial<PolicyFormValues>[];

@Component({
  selector: 'app-policies-form',
  templateUrl: './policies-form.component.html',
  styleUrls: ['./policies-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoliciesFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoliciesFormComponent),
      multi: true,
    },
  ],
})
export class PoliciesFormComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy {
  form: FormGroup;

  get formArray(): FormArray {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('formArray') as FormArray;
  }

  get add(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('add') as FormControl;
  }

  policyIsDuplicatedEvent = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      add: null,
      formArray: this.formBuilder.array([], PoliciesFormComponent.validateNoDuplicates),
    });

    this.subscriptions.push(
      this.formArray.valueChanges.subscribe((value: PoliciesFormValues | null) => {
        this.policyIsDuplicatedEvent.emit(this.policyIsDuplicated(this.add.value));
        this.onChange.forEach((fn) => fn(value));
        this.onTouched.forEach((fn) => fn());
      })
    );

    this.subscribeToAddValueChanges();
  }

  subscribeToAddValueChanges() {
    this.subscriptions.push(
      this.add.valueChanges.subscribe((value) => {
        this.policyIsDuplicatedEvent.emit(this.policyIsDuplicated(value));
      })
    );
    this.cleanupSubscriptions();
  }

  cleanupSubscriptions() {
    this.subscriptions = this.subscriptions.filter((s) => !s.closed);
  }

  validate(_: FormControl): ValidationErrors | null {
    return this.formArray.valid ? null : { policies: true };
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formArray.disable() : this.formArray.enable();
  }

  writeValue(value?: PartialPoliciesFormValues | null): void {
    this.formArray.clear({ emitEvent: false });
    if (value !== null && value !== undefined) {
      value.forEach((policy) => this.formArray.push(PolicyFormComponent.buildForm(policy), { emitEvent: false }));
    }
  }

  /**
   * This method listens to the event emitter from the child component and adds the policy into the list
   * @param policy The policy being taken in from the child component to be added
   */
  addPolicyHandler(policy: PolicyFormValues) {
    if (this.policyIsDuplicated(policy)) {
      this.policyIsDuplicatedEvent.emit(true);
    } else {
      const policyForm = PolicyFormComponent.buildForm(policy);
      this.formArray.push(policyForm);
      this.add.reset(null, { emitEvent: false });
      this.subscribeToAddValueChanges();
      this.cdRef.detectChanges();
    }
  }

  /**
   * Handle policy removal actions triggered by a child form button
   * @param index the index of the policy to remove
   */
  removePolicyHandler(index: number) {
    if (!this.formArray.length || index < 0 || index >= this.formArray.length) {
      throw new Error(`Unable to remove policy, index (${index}) out of bounds.`);
    }
    this.formArray.removeAt(index);
    this.formArray.controls.forEach((c) => c.updateValueAndValidity());
    this.policyIsDuplicatedEvent.emit(this.policyIsDuplicated(this.add.value ?? {}));
    this.cdRef.detectChanges();
  }

  /**
   * Tests whether the given policy already exists
   * @param policy the policy to test
   * @returns true if the policy is duplicated, false otherwise
   */
  policyIsDuplicated(policy: PolicyFormValues): boolean {
    const policies = this.formArray.value ?? [];
    return PoliciesFormComponent.policyIsDuplicated(policies, policy);
  }

  /**
   * Tests whether the given policy already exists in the provided list
   * @param policies the list of policies to test against
   * @param policy the policy to test (should be a reference from the provided list to avoid self-duplicate detection)
   * @returns true if the policy is duplicated, false otherwise
   */
  static policyIsDuplicated(policies: PoliciesFormValues, policy: PolicyFormValues): boolean {
    for (const otherPolicy of policies) {
      if (policy === otherPolicy) {
        continue;
      }
      switch (policy.type) {
        case PolicyType.DELAY_RESPONSE:
          if (otherPolicy.type === PolicyType.DELAY_RESPONSE) {
            return true;
          }
          break;
        default: {
          const _: never = policy.type;
        }
      }
    }

    return false;
  }

  /**
   * A reactive forms validator function that validates a FormArray containing policy controls
   * @param formArray the FormArray object to validate
   * @returns a ValidationErrors object containing any errors, or null if there are no errors
   */
  static validateNoDuplicates(formArray: FormArray): ValidationErrors | null {
    const policies: PoliciesFormValues = formArray.value ?? [];
    const controls: AbstractControl[] = formArray.controls;
    let error: ValidationErrors | null = null;

    for (let i = 0; i < controls.length; i++) {
      const control = controls[i];
      const policyIsDuplicated = PoliciesFormComponent.policyIsDuplicated(policies, policies[i]);

      if (policyIsDuplicated !== control.hasError('duplicate')) {
        if (policyIsDuplicated) {
          error = { duplicate: 'A duplicate policy (type or value) exists. Duplicates are not allowed.' };
          control.setErrors({
            ...(control.errors ?? {}),
            ...error,
          });
        } else {
          const { duplicate: _, ...errors } = control.errors;
          control.setErrors(Object.keys(errors).length ? errors : null);
        }
      }
    }

    return error;
  }

  /*
   * Boilerplate Code Below Here
   */

  private subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  readonly onChange: Array<(value: PoliciesFormValues) => void> = [];
  readonly onTouched: Array<() => void> = [];

  registerOnChange(fn: (value: PoliciesFormValues) => void): void {
    this.onChange.push(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched.push(fn);
  }
}
