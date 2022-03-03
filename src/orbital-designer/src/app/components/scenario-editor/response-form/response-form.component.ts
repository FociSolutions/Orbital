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
import { ValidJsonService } from 'src/app/services/valid-json/valid-json.service';
import HttpStatusCodes, { StatusCodes } from 'http-status-codes';
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
import { ResponseType } from 'src/app/models/mock-definition/scenario/response-type';
import { JsonEditorOptions } from 'ang-jsoneditor';
import { KeyValuePairFormValues } from 'src/app/shared/components/key-value-pair-form/key-value-pair-form.component';

export interface ResponseFormValues {
  type: ResponseType;
  status: number;
  headers: Record<string, string>;
  body: string;
}

export interface InternalResponseFormValues {
  type: ResponseType;
  status: number;
  headers: KeyValuePairFormValues;
  body: string;
}

@Component({
  selector: 'app-response-form',
  templateUrl: './response-form.component.html',
  styleUrls: ['./response-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ResponseFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ResponseFormComponent),
      multi: true,
    },
  ],
})
export class ResponseFormComponent implements ControlValueAccessor, Validator, OnInit, OnChanges, OnDestroy {
  form: FormGroup;

  get type(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('type') as FormControl;
  }
  get status(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('status') as FormControl;
  }
  get headers(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('headers') as FormControl;
  }
  get body(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('body') as FormControl;
  }

  @Input() touched = false;

  @Output() touchedEvent = new EventEmitter<void>();

  readonly responseTypes = [
    { value: ResponseType.CUSTOM, label: 'Custom' },
    { value: ResponseType.TEMPLATED, label: 'Templated' },
  ];

  bodyEditorOptions = new JsonEditorOptions();

  defaults: InternalResponseFormValues = {
    type: ResponseType.CUSTOM,
    status: StatusCodes.OK,
    headers: [],
    body: '{}',
  };

  initBodyData = {};
  bodyDataWasFocused = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      type: [this.defaults.type, Validators.required],
      status: [this.defaults.status, [Validators.required, ResponseFormComponent.statusCodeValidator]],
      headers: this.defaults.headers,
      body: [this.defaults.body, [ValidJsonService.getValidator(false)]],
    });

    this.subscriptions.push(
      this.form.valueChanges.subscribe((value: InternalResponseFormValues | null) => {
        this.onChange.forEach((fn) => fn(this.adaptInternalFormatToExternal(value)));
      })
    );

    this.bodyEditorOptions.mode = 'code';
    this.bodyEditorOptions.modes = ['code', 'text'];
    this.bodyEditorOptions.statusBar = true;
    this.bodyEditorOptions.onFocus = () => (this.bodyDataWasFocused = true);
    this.bodyEditorOptions.onBlur = () => {
      if (this.bodyDataWasFocused) {
        this.body.markAsTouched();
        this.touch();
      }
    };
    this.bodyEditorOptions.onChangeText = (jsonString: string) => {
      this.body.markAsDirty();
      this.body.setValue(jsonString);
    };
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

  adaptInternalFormatToExternal(values: InternalResponseFormValues | null): ResponseFormValues | null {
    return !values
      ? null
      : {
          ...values,
          headers: values.headers.reduce((out, { key, value }) => ({ ...out, [key]: value }), {}),
        };
  }

  adaptExternalFormatToInternal(
    values: Partial<ResponseFormValues> | null
  ): Partial<InternalResponseFormValues> | null {
    return !values
      ? null
      : {
          ...values,
          headers: !values.headers ? undefined : Object.entries(values.headers).map(([key, value]) => ({ key, value })),
        };
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  writeValue(value?: Partial<ResponseFormValues> | null): void {
    if (value === null || value === undefined) {
      this.form.reset(this.defaults, { emitEvent: false });
    } else {
      this.form.patchValue(this.adaptExternalFormatToInternal(value) ?? {}, { emitEvent: false });
    }
    this.initBodyData = this.safeParseJson(this.body.value);
  }

  safeParseJson(json: string): object {
    try {
      return JSON.parse(json);
    } catch (e) {
      return {};
    }
  }

  getStatusDescription(code: number | null): string {
    if (code === null) {
      return 'Enter a Status Code';
    }
    try {
      return HttpStatusCodes.getStatusText(Number(code));
    } catch (e: unknown) {
      return '';
    }
  }

  static statusCodeValidator(control: AbstractControl): ValidationErrors | null {
    try {
      if (control.value !== null && control.value.toString() !== '') {
        HttpStatusCodes.getStatusText(control.value);
      }
    } catch (e: unknown) {
      return { invalid: 'Invalid Status Code' };
    }
    return null;
  }

  /*
   * Boilerplate Code Below Here
   */

  validate(_: FormControl): ValidationErrors | null {
    return this.form.valid ? null : { response: true };
  }

  private readonly subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  readonly onChange: Array<(value: ResponseFormValues | null) => void> = [];
  readonly onTouched: Array<() => void> = [];

  registerOnChange(fn: (value: ResponseFormValues | null) => void): void {
    this.onChange.push(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched.push(fn);
  }
}
