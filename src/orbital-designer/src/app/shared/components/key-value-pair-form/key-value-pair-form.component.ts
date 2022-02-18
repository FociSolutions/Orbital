import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
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
  ValidatorFn,
} from '@angular/forms';
import {
  KeyValuePairItemFormComponent,
  KeyValuePairItemFormValues,
} from './key-value-pair-item-form/key-value-pair-item-form.component';

export type KeyValuePairFormValues = KeyValuePairItemFormValues[];

@Component({
  selector: 'app-key-value-pair-form',
  templateUrl: './key-value-pair-form.component.html',
  styleUrls: ['./key-value-pair-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KeyValuePairFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => KeyValuePairFormComponent),
      multi: true,
    },
  ],
})
export class KeyValuePairFormComponent implements ControlValueAccessor, Validator, OnInit, OnChanges, OnDestroy {
  form: FormGroup;

  get formArray(): FormArray {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('formArray') as FormArray;
  }

  get add(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('add') as FormControl;
  }

  @Input() itemName = 'Key Value Pair';
  @Input() itemNamePlural = 'Key Value Pairs';
  @Input() allowDuplicateKeys = false;

  itemIsDuplicatedEvent = new EventEmitter<boolean>();

  validateNoDuplicatesInstance = KeyValuePairFormComponent.validateNoDuplicates(false);

  constructor(private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      add: null,
      formArray: this.formBuilder.array([], this.validateNoDuplicatesInstance),
    });

    this.subscriptions.push(
      this.formArray.valueChanges.subscribe((values: KeyValuePairFormValues | null) => {
        this.itemIsDuplicatedEvent.emit(this.itemIsDuplicated(this.add.value));
        this.onChange.forEach((fn) => fn(values));
        this.onTouched.forEach((fn) => fn());
      })
    );

    this.subscribeToAddValueChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.allowDuplicateKeys && !changes.allowDuplicateKeys.firstChange) {
      this.formArray.removeValidators(this.validateNoDuplicatesInstance);
      this.validateNoDuplicatesInstance = KeyValuePairFormComponent.validateNoDuplicates(
        changes.allowDuplicateKeys.currentValue
      );
      this.formArray.addValidators(this.validateNoDuplicatesInstance);
    }
  }

  subscribeToAddValueChanges() {
    this.subscriptions.push(
      this.add.valueChanges.subscribe((value) => {
        this.itemIsDuplicatedEvent.emit(this.itemIsDuplicated(value));
      })
    );
    this.cleanupSubscriptions();
  }

  cleanupSubscriptions() {
    this.subscriptions = this.subscriptions.filter((s) => !s.closed);
  }

  validate(_: FormControl): ValidationErrors | null {
    return this.formArray.valid ? null : { key_value_pair: true };
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formArray.disable() : this.formArray.enable();
  }

  writeValue(values?: KeyValuePairFormValues | null): void {
    this.formArray.clear({ emitEvent: false });
    if (values !== null && values !== undefined) {
      values.forEach((item) =>
        this.formArray.push(KeyValuePairItemFormComponent.buildForm(item), { emitEvent: false })
      );
    }
  }

  /**
   * This method listens to the event emitter from the child component and adds the item into the list
   * @param item The item being taken in from the child component to be added
   */
  addItemHandler(item: KeyValuePairItemFormValues) {
    if (this.itemIsDuplicated(item)) {
      this.itemIsDuplicatedEvent.emit(true);
    } else {
      const itemForm = KeyValuePairItemFormComponent.buildForm(item);
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
    this.itemIsDuplicatedEvent.emit(this.itemIsDuplicated(this.add.value ?? {}));
    this.cdRef.detectChanges();
  }

  /**
   * Tests whether the given item already exists
   * @param item the item to test
   * @returns true if the item is duplicated, false otherwise
   */
  itemIsDuplicated(item: KeyValuePairItemFormValues | null): boolean {
    const items = this.formArray.value ?? [];
    return KeyValuePairFormComponent.itemIsDuplicated(items, item, this.allowDuplicateKeys);
  }

  /**
   * Tests whether the given item already exists in the provided list
   * @param items the list of items to test against
   * @param item the item to test (should be a reference from the provided list to avoid self-duplicate detection)
   * @returns true if the item is duplicated, false otherwise
   */
  static itemIsDuplicated(
    items: KeyValuePairFormValues,
    item: KeyValuePairItemFormValues | null,
    allowDuplicateKeys: boolean = false
  ): boolean {
    if (item) {
      for (const other of items) {
        if (item === other) {
          continue;
        }

        const itemIsDuplicated = item.key === other.key && (!allowDuplicateKeys || item.value === other.value);

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
  static validateNoDuplicates(allowDuplicateKeys: boolean = false): ValidatorFn {
    return (formArray: FormArray) => {
      const items: KeyValuePairFormValues = formArray.value ?? [];
      const controls: AbstractControl[] = formArray.controls;
      let error: ValidationErrors | null = null;

      for (let i = 0; i < controls.length; i++) {
        const control = controls[i];
        const itemIsDuplicated = KeyValuePairFormComponent.itemIsDuplicated(items, items[i], allowDuplicateKeys);

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
    };
  }

  /*
   * Boilerplate Code Below Here
   */

  private subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  readonly onChange: Array<(value: KeyValuePairFormValues) => void> = [];
  readonly onTouched: Array<() => void> = [];

  registerOnChange(fn: (value: KeyValuePairFormValues) => void): void {
    this.onChange.push(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched.push(fn);
  }
}
