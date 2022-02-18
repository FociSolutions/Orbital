import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestFormComponent, RequestFormValues } from './request-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../shared/shared.module';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { JsonEditorComponent } from 'ang-jsoneditor';
import { MatCardModule } from '@angular/material/card';

describe('RequestFormComponent', () => {
  let component: RequestFormComponent;
  let fixture: ComponentFixture<RequestFormComponent>;
  let SAMPLE_VALUE: RequestFormValues;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestFormComponent, JsonEditorComponent],
      imports: [SharedModule, MatCardModule, BrowserAnimationsModule, LoggerTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    SAMPLE_VALUE = {
      requestMatchRules: {
        headerRules: [],
        queryRules: [],
        bodyRules: [],
        urlRules: [],
      },
      tokenRules: [],
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('RequestFormComponent.writeValue', () => {
    it('should set the values for the form fields', () => {
      component.writeValue(SAMPLE_VALUE);
      expect(component.form.value).toEqual(SAMPLE_VALUE);
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

  describe('RequestFormComponent validation', () => {
    it('should not fail validation with valid inputs', () => {
      component.writeValue(SAMPLE_VALUE);

      const actual = component.validate(component.tokenRules);
      expect(actual).toBeNull();
    });
  });

  describe('RequestFormComponent.setDisabledState', () => {
    it('should set the disabled state to true on all the controls in the form group', () => {
      component.setDisabledState(true);

      expect(Object.values(component.form.controls).every((x) => x.disabled && !x.enabled)).toBe(true);
      expect(Object.values(component.requestMatchRules.controls).every((x) => x.disabled && !x.enabled)).toBe(true);
    });

    it('should set the disabled state to false on all the controls in the form group', () => {
      component.setDisabledState(true);
      component.setDisabledState(false);
      expect(Object.values(component.form.controls).every((x) => !x.disabled && x.enabled)).toBe(true);
      expect(Object.values(component.requestMatchRules.controls).every((x) => !x.disabled && x.enabled)).toBe(true);
    });
  });

  describe('RequestFormComponent.registerOnChange', () => {
    it('should set the onChange function', () => {
      const expected = () => undefined;
      component.registerOnChange(expected);

      expect(component.onChange).toContain(expected);
    });
  });

  describe('RequestFormComponent.registerOnTouched', () => {
    it('should set the onTouched function', () => {
      const expected = () => undefined;
      component.registerOnTouched(expected);

      expect(component.onTouched).toContain(expected);
    });
  });
});
