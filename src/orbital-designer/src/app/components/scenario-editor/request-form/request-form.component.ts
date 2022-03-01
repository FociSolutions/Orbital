import { Component, OnDestroy, OnInit, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { KeyValueRuleFormValues } from 'src/app/shared/components/key-value-rule-form/key-value-rule-form.component';
import { UrlRuleFormValues } from 'src/app/shared/components/url-rule-form/url-rule-form.component';
import { BodyRuleFormValues } from '../body-rule-form/body-rule-form.component';

export interface RequestFormValues {
  requestMatchRules: {
    headerRules: KeyValueRuleFormValues;
    queryRules: KeyValueRuleFormValues;
    bodyRules: BodyRuleFormValues;
    urlRules: UrlRuleFormValues;
  };
  tokenRules: KeyValueRuleFormValues;
}

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RequestFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RequestFormComponent),
      multi: true,
    },
  ],
})
export class RequestFormComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy {
  form: FormGroup;

  get requestMatchRules(): FormGroup {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('requestMatchRules') as FormGroup;
  }

  get headerRules(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('requestMatchRules.headerRules') as FormControl;
  }
  get queryRules(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('requestMatchRules.queryRules') as FormControl;
  }
  get bodyRules(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('requestMatchRules.bodyRules') as FormControl;
  }
  get urlRules(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('requestMatchRules.urlRules') as FormControl;
  }
  get tokenRules(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.form.get('tokenRules') as FormControl;
  }

  static readonly ruleTypesStatic = {
    header: 'Header Match Rules',
    query: 'Query Param Match Rules',
    url: 'URL Match Rules',
    body: 'Body Match Rules',
    token_payload: 'Token Payload Match Rules',
  } as const;

  readonly ruleTypes = RequestFormComponent.ruleTypesStatic;

  currentRuleType: keyof typeof RequestFormComponent.ruleTypesStatic = 'header';

  defaults: RequestFormValues = {
    requestMatchRules: {
      headerRules: null,
      queryRules: null,
      bodyRules: null,
      urlRules: null,
    },
    tokenRules: null,
  };

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      requestMatchRules: this.formBuilder.group({
        headerRules: null,
        queryRules: null,
        bodyRules: null,
        urlRules: null,
      }),
      tokenRules: null,
    });

    this.subscriptions.push(
      this.form.valueChanges.subscribe((value: RequestFormValues | null) => {
        this.onChange.forEach((fn) => fn(value));
        this.onTouched.forEach((fn) => fn());
      })
    );
  }

  writeValue(value?: Partial<RequestFormValues> | null): void {
    if (value === null || value === undefined) {
      this.form.reset(this.defaults, { emitEvent: false });
    } else {
      this.form.patchValue(value, { emitEvent: false });
    }
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
      this.requestMatchRules.disable();
    } else {
      this.form.enable();
      this.requestMatchRules.enable();
    }
  }

  /**
   * A sort comparison function that treats all objects as having the same order.
   * Needed until angular ticket 42490 is implemented: https://github.com/angular/angular/issues/42490
   * @returns 0
   */
  compareAllEqual(_a: unknown, _b: unknown) {
    return 0;
  }

  /*
   * Boilerplate Code Below Here
   */

  validate(_: FormControl): ValidationErrors | null {
    return this.form.valid ? null : { request: true };
  }

  private readonly subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  readonly onChange: Array<(value: RequestFormValues) => void> = [];
  readonly onTouched: Array<() => void> = [];

  registerOnChange(fn: (value: RequestFormValues) => void): void {
    this.onChange.push(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched.push(fn);
  }
}