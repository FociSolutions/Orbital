import {
  ChangeDetectorRef,
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
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { BodyRuleItemFormComponent, BodyRuleItemFormValues } from './body-rule-item-form/body-rule-item-form.component';

export type BodyRuleFormValues = BodyRuleItemFormValues[];

@Component({
  selector: 'app-body-rule-form',
  templateUrl: './body-rule-form.component.html',
  styleUrls: ['./body-rule-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BodyRuleFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BodyRuleFormComponent),
      multi: true,
    },
  ],
})
export class BodyRuleFormComponent implements ControlValueAccessor, Validator, OnInit, OnChanges, OnDestroy {
  form: FormGroup;

  get formArray(): FormArray {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('formArray') as FormArray;
  }

  get add(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('add') as FormControl;
  }

  @Input() itemName = 'Body Match Rule';
  @Input() itemNamePlural = 'Body Match Rules';
  @Input() touched = false;

  @Output() touchedEvent = new EventEmitter<void>();

  newItemIndex = null;

  itemIsDuplicatedEvent = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([], BodyRuleFormComponent.validateNoDuplicates),
    });

    this.subscriptions.push(
      this.formArray.valueChanges.subscribe((values: BodyRuleFormValues | null) => {
        this.itemIsDuplicatedEvent.emit(this.itemIsDuplicated(this.add.value));
        this.onChange.forEach((fn) => fn(values));
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.touched?.firstChange && changes.touched?.currentValue) {
      this.formArray.markAllAsTouched();
    }
  }

  touch() {
    this.onTouched.forEach((fn) => fn());
    this.touchedEvent.emit();
  }

  subscribeToAddValueChanges() {
    this.subscriptions.push(
      this.add.valueChanges.subscribe((value) => {
        this.itemIsDuplicatedEvent.emit(this.itemIsDuplicated(value));
      })
    );
  }

  validate(_: FormControl): ValidationErrors | null {
    return this.formArray.valid ? null : { body_rule: true };
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formArray.disable() : this.formArray.enable();
  }

  writeValue(values?: BodyRuleFormValues | null): void {
    this.formArray.clear({ emitEvent: false });
    if (values !== null && values !== undefined) {
      values.forEach((item) => this.formArray.push(BodyRuleItemFormComponent.buildForm(item), { emitEvent: false }));
    }
  }

  addItemHandler(item: BodyRuleItemFormValues) {
    if (this.itemIsDuplicated(item)) {
      this.itemIsDuplicatedEvent.emit(true);
    } else {
      this.newItemIndex = this.formArray.length;
      const itemForm = BodyRuleItemFormComponent.buildForm({});
      this.formArray.push(itemForm);
      this.add.reset(null, { emitEvent: false });
      this.subscribeToAddValueChanges();
      this.cdRef.detectChanges();
    }
  }

  /**
   * Handle item removal actions triggered by a child form button
   * @param index the index of the item to remove
   */
  removeItemHandler(index: number) {
    if (!this.formArray.length || index < 0 || index >= this.formArray.length) {
      throw new Error(`Unable to remove item, index (${index}) out of bounds.`);
    }
    this.formArray.removeAt(index);
    this.formArray.controls.forEach((c) => c.updateValueAndValidity());
    this.cdRef.detectChanges();
  }

  /**
   * Tests whether the given item already exists
   * @param item the item to test
   * @returns true if the item is duplicated, false otherwise
   */
  itemIsDuplicated(item: BodyRuleItemFormValues | null): boolean {
    const items = this.formArray.value ?? [];
    return BodyRuleFormComponent.itemIsDuplicated(items, item);
  }

  /**
   * Tests whether the given item already exists in the provided list
   * @param items the list of items to test against
   * @param item the item to test (should be a reference from the provided list to avoid self-duplicate detection)
   * @returns true if the item is duplicated, false otherwise
   */
  static itemIsDuplicated(items: BodyRuleFormValues, item: BodyRuleItemFormValues | null): boolean {
    if (item) {
      for (const other of items) {
        if (item === other) {
          continue;
        }

        const itemIsDuplicated = item.type === other.type && item.value === other.value;

        if (itemIsDuplicated) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * A reactive forms validator function that validates a FormArray containing kvp controls
   * @param formArray the FormArray object to validate
   * @returns a ValidationErrors object containing any errors, or null if there are no errors
   */
  static validateNoDuplicates(formArray: FormArray): ValidationErrors | null {
    const items: BodyRuleFormValues = formArray.value ?? [];
    const controls: AbstractControl[] = formArray.controls;
    let error: ValidationErrors | null = null;

    for (let i = 0; i < controls.length; i++) {
      const control = controls[i];
      const itemIsDuplicated = BodyRuleFormComponent.itemIsDuplicated(items, items[i]);

      if (itemIsDuplicated !== control.hasError('duplicate')) {
        if (itemIsDuplicated) {
          error = { duplicate: 'A duplicate item exists. Duplicates are not allowed.' };
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

  private readonly subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  readonly onChange: Array<(value: BodyRuleFormValues) => void> = [];
  readonly onTouched: Array<() => void> = [];

  registerOnChange(fn: (value: BodyRuleFormValues) => void): void {
    this.onChange.push(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched.push(fn);
  }
}
