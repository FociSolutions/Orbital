import { Component, Input, OnDestroy, Output, forwardRef } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

export interface MetadataFormValues {
  title: string;
  description: string;
}

@Component({
  selector: 'app-metadata-form',
  templateUrl: './metadata-form.component.html',
  styleUrls: ['./metadata-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MetadataFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MetadataFormComponent),
      multi: true,
    },
  ],
})
export class MetadataFormComponent implements ControlValueAccessor, OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  @Output() form: FormGroup;

  @Input() readonly title_maxlength = 50;
  @Input() readonly description_maxlength = 500;

  get title(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('title') as FormControl;
  }
  get description(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('description') as FormControl;
  }

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(this.title_maxlength),
          MetadataFormComponent.notOnlyWhiteSpaceValidator,
        ],
      ],
      description: ['', [Validators.maxLength(this.description_maxlength)]],
    });

    this.subscriptions.push(
      this.form.valueChanges.subscribe((value) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  validate(_: FormControl): ValidationErrors | null {
    return this.form.valid ? null : { metadata: { valid: false } };
  }

  setDisabledState(isDisabled: boolean): void {
    Object.values(this.form.controls).forEach((c) => (isDisabled ? c.disable() : c.enable()));
  }

  writeValue(value?: MetadataFormValues | null): void {
    if (value === null || value === undefined) {
      this.form.reset();
    } else {
      this.form.setValue(value);
    }
  }

  registerOnChange(fn: (value: MetadataFormValues) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Provide default implementations for these, which can be overridden with the register functions
  onChange = (_value: MetadataFormValues): void => undefined;
  onTouched = (): void => undefined;

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  static notOnlyWhiteSpaceValidator(control: AbstractControl): ValidationErrors | null {
    if (/^\s+$/.test(control.value)) {
      return { whitespace: 'Must contain at least one character that is not a space.' };
    }
    return null;
  }
}
