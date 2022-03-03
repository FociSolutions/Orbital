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
export class MetadataFormComponent implements ControlValueAccessor, Validator, OnInit, OnChanges, OnDestroy {
  form: FormGroup;

  get title(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('title') as FormControl;
  }
  get description(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('description') as FormControl;
  }

  @Input() touched = false;
  @Input() readonly title_maxlength = 50;
  @Input() readonly description_maxlength = 500;

  @Output() touchedEvent = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: [
        null,
        [
          Validators.required,
          Validators.maxLength(this.title_maxlength),
          MetadataFormComponent.notOnlyWhiteSpaceValidator,
        ],
      ],
      description: [null, [Validators.maxLength(this.description_maxlength)]],
    });

    this.subscriptions.push(
      this.form.valueChanges.subscribe((value: MetadataFormValues | null) => {
        this.onChange.forEach((fn) => fn(value));
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

  validate(_: FormControl): ValidationErrors | null {
    return this.form.valid ? null : { metadata: true };
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  writeValue(value?: Partial<MetadataFormValues> | null): void {
    if (value === null || value === undefined) {
      this.form.reset({ value: null }, { emitEvent: false });
    } else {
      this.form.patchValue(value, { emitEvent: false });
    }
  }

  static notOnlyWhiteSpaceValidator(control: AbstractControl): ValidationErrors | null {
    if (/^\s+$/.test(control.value)) {
      return { whitespace: 'Must contain at least one character that is not a space.' };
    }
    return null;
  }

  /*
   * Boilerplate Code Below Here
   */

  private readonly subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  readonly onChange: Array<(value: MetadataFormValues | null) => void> = [];
  readonly onTouched: Array<() => void> = [];

  registerOnChange(fn: (value: MetadataFormValues | null) => void): void {
    this.onChange.push(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched.push(fn);
  }
}
