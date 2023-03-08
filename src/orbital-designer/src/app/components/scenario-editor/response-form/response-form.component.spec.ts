import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternalResponseFormValues, ResponseFormComponent, ResponseFormValues } from './response-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../shared/shared.module';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MatCardModule } from '@angular/material/card';
import { StatusCodes } from 'http-status-codes';
import { ResponseType } from 'src/app/models/mock-definition/scenario/response-type';
import { AbstractControl, FormControl } from '@angular/forms';
import { SimpleChanges } from '@angular/core';
import { JsonEditorComponent } from 'ang-jsoneditor';

describe('ResponseFormComponent', () => {
  let component: ResponseFormComponent;
  let fixture: ComponentFixture<ResponseFormComponent>;
  let SAMPLE_VALUE: ResponseFormValues;
  let INT_SAMPLE_VALUE: InternalResponseFormValues;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponseFormComponent, JsonEditorComponent],
      imports: [SharedModule, MatCardModule, BrowserAnimationsModule, LoggerTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    SAMPLE_VALUE = {
      type: ResponseType.CUSTOM,
      status: StatusCodes.OK,
      headers: { 'Content-Type': 'application/json' },
      body: '{ "test": "value" }',
    };
    INT_SAMPLE_VALUE = {
      ...SAMPLE_VALUE,
      headers: Object.entries(SAMPLE_VALUE.headers).map(([key, value]) => ({ key, value })),
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ResponseFormComponent.writeValue', () => {
    it('should set the values for the form fields', () => {
      component.writeValue(SAMPLE_VALUE);
      expect(component.form.value).toEqual(INT_SAMPLE_VALUE);
    });

    it('should reset the values in the form when null is passed in', () => {
      component.writeValue(null);

      expect(component.form.value).toEqual(component.defaults);
    });

    it('should not notify of a change when called', () => {
      const spy = jest.fn();
      component.registerOnChange(spy);

      component.writeValue(SAMPLE_VALUE);
      component.writeValue(null);

      expect(spy).toHaveBeenCalledTimes(0);
      spy.mockRestore();
    });

    it('should not notify of a touch when called', () => {
      const spy = jest.fn();
      component.registerOnTouched(spy);

      component.writeValue(SAMPLE_VALUE);
      component.writeValue(null);

      expect(spy).toHaveBeenCalledTimes(0);
      spy.mockRestore();
    });
  });

  describe('ResponseFormComponent validation', () => {
    it('should not fail validation with valid inputs', () => {
      component.writeValue(SAMPLE_VALUE);

      const actual = component.validate(component.type);
      expect(actual).toBeNull();
    });

    it('should fail validation if the type field is empty', () => {
      const value: ResponseFormValues = { ...SAMPLE_VALUE, type: null as unknown as ResponseType };
      component.writeValue(value);

      const actual = component.type.validator?.(component.type);
      expect(actual).toBeTruthy();
      expect(actual?.required).toBeTruthy();
      expect(component.validate(null as unknown as FormControl)).toBeTruthy();
    });

    it('should fail validation if the status field is empty', () => {
      const value: ResponseFormValues = { ...SAMPLE_VALUE, status: null as unknown as number };
      component.writeValue(value);

      const actual = component.status.validator?.(component.status);
      expect(actual).toBeTruthy();
      expect(actual?.required).toBeTruthy();
      expect(component.validate(null as unknown as FormControl)).toBeTruthy();
    });

    it('should fail validation if the there are duplicate headers', () => {
      component.writeValue(null);
      component.headers.setValue([...INT_SAMPLE_VALUE.headers, ...INT_SAMPLE_VALUE.headers]);

      const actual = component.headers.validator?.(component.headers);
      expect(actual).toBeTruthy();
      expect(actual?.key_value_pair).toBeTruthy();
      expect(component.validate(null as unknown as FormControl)).toBeTruthy();
    });

    it('should fail validation if the body field is not valid json', () => {
      const value: ResponseFormValues = { ...SAMPLE_VALUE, body: 'not_json' };
      component.writeValue(value);

      const actual = component.body.validator?.(component.body);
      expect(actual).toBeTruthy();
      expect(actual?.invalid).toBeTruthy();
      expect(component.validate(null as unknown as FormControl)).toBeTruthy();
    });

    it('should fail validation if the body field has a top level string', () => {
      const value: ResponseFormValues = { ...SAMPLE_VALUE, body: '"a_string"' };
      component.writeValue(value);

      const actual = component.body.validator?.(component.body);
      expect(actual).toBeTruthy();
      expect(actual?.top_level_object).toBeTruthy();
      expect(component.validate(null as unknown as FormControl)).toBeTruthy();
    });

    it('should fail validation if the body field has a top level number', () => {
      const value: ResponseFormValues = { ...SAMPLE_VALUE, body: '1' };
      component.writeValue(value);

      const actual = component.body.validator?.(component.body);
      expect(actual).toBeTruthy();
      expect(actual?.top_level_object).toBeTruthy();
      expect(component.validate(null as unknown as FormControl)).toBeTruthy();
    });

    it('should fail validation if the body field has a top level boolean', () => {
      const value: ResponseFormValues = { ...SAMPLE_VALUE, body: 'true' };
      component.writeValue(value);

      const actual = component.body.validator?.(component.body);
      expect(actual).toBeTruthy();
      expect(actual?.top_level_object).toBeTruthy();
      expect(component.validate(null as unknown as FormControl)).toBeTruthy();
    });

    it('should fail validation if the body field has a top level null', () => {
      const value: ResponseFormValues = { ...SAMPLE_VALUE, body: 'true' };
      component.writeValue(value);

      const actual = component.body.validator?.(component.body);
      expect(actual).toBeTruthy();
      expect(actual?.top_level_object).toBeTruthy();
      expect(component.validate(null as unknown as FormControl)).toBeTruthy();
    });

    it('should fail validation if the body field has a top level array', () => {
      const value: ResponseFormValues = { ...SAMPLE_VALUE, body: '[]' };
      component.writeValue(value);

      const actual = component.body.validator?.(component.body);
      expect(actual).toBeTruthy();
      expect(actual?.top_level_object).toBeTruthy();
      expect(component.validate(null as unknown as FormControl)).toBeTruthy();
    });
  });

  describe('ResponseFormComponent.setDisabledState', () => {
    it('should set the disabled state to true on all the controls in the form group', () => {
      component.setDisabledState(true);
      expect(Object.values(component.form.controls).every((x) => x.disabled && !x.enabled)).toBe(true);
    });

    it('should set the disabled state to false on all the controls in the form group', () => {
      component.setDisabledState(true);
      component.setDisabledState(false);
      expect(Object.values(component.form.controls).every((x) => !x.disabled && x.enabled)).toBe(true);
    });
  });

  describe('ResponseFormComponent.registerOnChange', () => {
    it('should set the onChange function', () => {
      const expected = () => undefined;
      component.registerOnChange(expected);

      expect(component.onChange).toContain(expected);
    });
  });

  describe('ResponseFormComponent.registerOnTouched', () => {
    it('should set the onTouched function', () => {
      const expected = () => undefined;
      component.registerOnTouched(expected);

      expect(component.onTouched).toContain(expected);
    });
  });

  describe('ResponseFormComponent.adaptInternalFormatToExternal', () => {
    it('should convert a value properly', () => {
      const actual = component.adaptInternalFormatToExternal(INT_SAMPLE_VALUE);

      expect(actual).toEqual(SAMPLE_VALUE);
    });

    it('should convert null properly', () => {
      const actual = component.adaptInternalFormatToExternal(null);

      expect(actual).toBeNull();
    });
  });

  describe('ResponseFormComponent.adaptExternalFormatToInternal', () => {
    it('should convert a value properly', () => {
      const actual = component.adaptExternalFormatToInternal(SAMPLE_VALUE);

      expect(actual).toEqual(INT_SAMPLE_VALUE);
    });

    it('should convert null properly', () => {
      const actual = component.adaptExternalFormatToInternal(null);

      expect(actual).toBeNull();
    });
  });

  describe('ResponseFormComponent.safeParseJson', () => {
    it('should parse valid json properly', () => {
      const json = `
        {
          "test": "value",
          "number": 1
        }
      `;
      const actual = component.safeParseJson(json);

      expect(actual).toEqual({ test: 'value', number: 1 });
    });

    it('should return an empty object with invalid json', () => {
      const json = '"test": "value"';
      const actual = component.safeParseJson(json);

      expect(actual).toEqual({});
      expect(Object.keys(actual).length).toBe(0);
    });
  });

  describe('ResponseFormComponent.getStatusDescription', () => {
    it('should return the proper description for a sample status code', () => {
      const actual = component.getStatusDescription(201);
      const expected = 'Created';
      expect(actual).toEqual(expected);
    });

    it('should return a message when there is no code (null) provided', () => {
      const actual = component.getStatusDescription(null);
      const expected = 'Enter a Status Code';
      expect(actual).toEqual(expected);
    });

    it('should return an empty string when an invalid code is provided', () => {
      const actual = component.getStatusDescription(0);
      const expected = '';
      expect(actual).toEqual(expected);
    });
  });

  describe('ResponseFormComponent.statusCodeValidator', () => {
    it('should return null if the input contains a valid status code', () => {
      const control = { value: 200 } as AbstractControl;
      const actual = ResponseFormComponent.statusCodeValidator(control);

      expect(actual).toBeNull();
    });

    it('should return null if the input is empty', () => {
      const control = { value: '' } as AbstractControl;
      const actual = ResponseFormComponent.statusCodeValidator(control);

      expect(actual).toBeNull();
    });

    it('should return null if the input is null', () => {
      const control = { value: null } as AbstractControl;
      const actual = ResponseFormComponent.statusCodeValidator(control);

      expect(actual).toBeNull();
    });

    it('should return an error if the input is an invalid status code', () => {
      const control = { value: 0 } as AbstractControl;
      const actual = ResponseFormComponent.statusCodeValidator(control);

      expect(actual).toBeTruthy();
      expect(actual?.invalid).toBeTruthy();
    });
  });

  describe('ResponseFormComponent.ngOnChanges', () => {
    it('should mark the form as touched if the touched input is true and not the firstChange', () => {
      const changes: SimpleChanges = {
        touched: {
          isFirstChange: () => false,
          firstChange: false,
          previousValue: undefined,
          currentValue: true,
        },
      };
      component.ngOnChanges(changes);

      expect(component.form.touched).toBe(true);
    });

    it('should not mark the form as touched if the touched input is false and not the firstChange', () => {
      const changes: SimpleChanges = {
        touched: {
          isFirstChange: () => false,
          firstChange: false,
          previousValue: undefined,
          currentValue: false,
        },
      };
      component.ngOnChanges(changes);

      expect(component.form.touched).toBe(false);
    });

    it('should not mark the form as touched if the input is the firstChange', () => {
      const changes: SimpleChanges = {
        touched: {
          isFirstChange: () => true,
          firstChange: true,
          previousValue: undefined,
          currentValue: true,
        },
      };
      component.ngOnChanges(changes);

      expect(component.form.touched).toBe(false);
    });

    it('should not mark the form as touched if the input does not contain the touched change', () => {
      const changes: SimpleChanges = {};
      component.ngOnChanges(changes);

      expect(component.form.touched).toBe(false);
    });
  });

  describe('ResponseFormComponent.touch', () => {
    it('should execute the onTouched callbacks', () => {
      const spy = jest.fn();
      component.registerOnTouched(spy);
      component.touch();

      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });

    it('should emit a touchedEvent when called', () => {
      const spy = jest.spyOn(component.touchedEvent, 'emit');
      component.touch();

      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });
  });
});
