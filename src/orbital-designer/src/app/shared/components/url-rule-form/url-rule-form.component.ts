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
import { UrlRuleItemFormComponent, UrlRuleItemFormValues } from './url-rule-item-form/url-rule-item-form.component';

export type UrlRuleFormValues = UrlRuleItemFormValues[];

@Component({
  selector: 'app-url-rule-form',
  templateUrl: './url-rule-form.component.html',
  styleUrls: ['./url-rule-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UrlRuleFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UrlRuleFormComponent),
      multi: true,
    },
  ],
})
export class UrlRuleFormComponent implements ControlValueAccessor, Validator, OnInit, OnChanges, OnDestroy {
  form: FormGroup = this.formBuilder.group({});

  get formArray(): FormArray {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('formArray') as FormArray;
  }

  get add(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('add') as FormControl;
  }

  @Input() itemName = 'URL Match Rule';
  @Input() itemNamePlural = 'URL Match Rules';
  @Input() touched = false;

  @Output() touchedEvent = new EventEmitter<void>();

  itemIsDuplicatedEvent = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      add: null,
      formArray: this.formBuilder.array([], UrlRuleFormComponent.validateNoDuplicates),
    });

    this.subscriptions.push(
      this.formArray.valueChanges.subscribe((values: UrlRuleFormValues | null) => {
        this.itemIsDuplicatedEvent.emit(this.itemIsDuplicated(this.add.value));
        this.onChange.forEach((fn) => fn(values));
      })
    );

    this.subscribeToAddValueChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.touched?.firstChange && changes.touched?.currentValue) {
      this.formArray.markAllAsTouched();
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

  touch() {
    this.onTouched.forEach((fn) => fn());
    this.touchedEvent.emit();
  }

  validate(_: FormControl): ValidationErrors | null {
    return this.formArray.valid ? null : { url_rule: true };
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formArray.disable() : this.formArray.enable();
  }

  writeValue(values?: UrlRuleFormValues | null): void {
    this.formArray.clear({ emitEvent: false });
    if (values !== null && values !== undefined) {
      values.forEach((item) => this.formArray.push(UrlRuleItemFormComponent.buildForm(item), { emitEvent: false }));
    }
  }

  /**
   * This method listens to the event emitter from the child component and adds the item into the list
   * @param item The item being taken in from the child component to be added
   */
  addItemHandler(item: UrlRuleItemFormValues) {
    if (this.itemIsDuplicated(item)) {
      this.itemIsDuplicatedEvent.emit(true);
    } else {
      const itemForm = UrlRuleItemFormComponent.buildForm(item);
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
  itemIsDuplicated(item: UrlRuleItemFormValues | null): boolean {
    const items = this.formArray.value ?? [];
    return UrlRuleFormComponent.itemIsDuplicated(items, item);
  }

  /**
   * Tests whether the given item already exists in the provided list
   * @param items the list of items to test against
   * @param item the item to test (should be a reference from the provided list to avoid self-duplicate detection)
   * @returns true if the item is duplicated, false otherwise
   */
  static itemIsDuplicated(items: UrlRuleFormValues, item: UrlRuleItemFormValues | null): boolean {
    if (item) {
      for (const other of items) {
        if (item === other) {
          continue;
        }

        const itemIsDuplicated = item.path === other.path && item.type === other.type;

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
  static validateNoDuplicates(formArray: AbstractControl): ValidationErrors | null {
    if (!(formArray instanceof FormArray)) {
      throw new Error('Validator can only be used with FormArray controls');
    }

    const items: UrlRuleFormValues = formArray.value ?? [];
    const controls: AbstractControl[] = formArray.controls;
    let error: ValidationErrors | null = null;

    for (let i = 0; i < controls.length; i++) {
      const control = controls[i];
      const itemIsDuplicated = UrlRuleFormComponent.itemIsDuplicated(items, items[i]);

      if (itemIsDuplicated !== control.hasError('duplicate')) {
        if (itemIsDuplicated) {
          error = { duplicate: 'A duplicate item exists. Duplicates are not allowed.' };
          control.setErrors({
            ...(control.errors ?? {}),
            ...error,
          });
        } else {
          const { duplicate: _, ...errors } = control.errors ?? {};
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

  readonly onChange: Array<(value: UrlRuleFormValues | null) => void> = [];
  readonly onTouched: Array<() => void> = [];

  registerOnChange(fn: (value: UrlRuleFormValues | null) => void): void {
    this.onChange.push(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched.push(fn);
  }
}
