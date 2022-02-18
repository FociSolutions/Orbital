import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { KeyValuePairItemFormComponent, KeyValuePairItemFormValues } from './key-value-pair-item-form.component';
import * as faker from 'faker';

describe('KvpFormComponent', () => {
  let component: KeyValuePairItemFormComponent;
  let fixture: ComponentFixture<KeyValuePairItemFormComponent>;
  let SAMPLE_VALUE: KeyValuePairItemFormValues;
  const VALUE_NULL: KeyValuePairItemFormValues = { key: null, value: null };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KeyValuePairItemFormComponent],
      imports: [
        BrowserAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyValuePairItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    SAMPLE_VALUE = {
      key: faker.random.word(),
      value: faker.random.words(4),
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('KvpFormComponent.writeValue', () => {
    it('should set the values for the form fields', () => {
      component.writeValue(SAMPLE_VALUE);
      expect(component.form.value).toEqual(SAMPLE_VALUE);
    });

    it('should clear the values in the form when null is passed in', () => {
      component.writeValue(null);

      expect(component.form.value).toEqual(VALUE_NULL);
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

  describe('KvpFormComponent validation', () => {
    it('should not fail validation with valid inputs', () => {
      component.writeValue(SAMPLE_VALUE);

      const actual = component.validate(component.key);
      expect(actual).toBeNull();
    });

    it('should fail validation if the key field is empty', () => {
      const value: KeyValuePairItemFormValues = { ...SAMPLE_VALUE, key: null };
      component.writeValue(value);

      const actual = component.key.validator(component.key);
      expect(actual).toBeTruthy();
      expect(actual.required).toBeTruthy();
      expect(component.validate(null)).toBeTruthy();
    });

    it('should fail validation if the value field is empty', () => {
      const value: KeyValuePairItemFormValues = { ...SAMPLE_VALUE, value: null };
      component.writeValue(value);

      const actual = component.value.validator(component.value);
      expect(actual).toBeTruthy();
      expect(actual.required).toBeTruthy();
      expect(component.validate(null)).toBeTruthy();
    });

    it('should fail validation if the entry is duplicated', () => {
      component.writeValue(SAMPLE_VALUE);
      component.itemIsDuplicatedEvent.emit(true);

      const actual = component.form.errors;
      expect(actual).toBeTruthy();
      expect(actual.duplicate).toBeTruthy();
      expect(component.validate(null)).toBeTruthy();
    });
  });

  describe('KvpFormComponent.setDisabledState', () => {
    it('should set the disabled state to true on all the controls in the form group', () => {
      component.setDisabledState(true);
      expect(Object.values(component.form.controls).every((x) => x.disabled && !x.enabled)).toBe(true);
    });

    it('should set the disabled state to false on all the controls in the form group', () => {
      component.writeValue(SAMPLE_VALUE);
      component.setDisabledState(true);
      component.setDisabledState(false);
      expect(Object.values(component.form.controls).every((x) => !x.disabled && x.enabled)).toBe(true);
    });
  });

  describe('KvpFormComponent.registerOnChange', () => {
    it('should set the onChange function', () => {
      const expected = () => undefined;
      component.registerOnChange(expected);

      expect(component.onChange).toContain(expected);
    });
  });

  describe('KvpFormComponent.registerOnTouched', () => {
    it('should set the onTouched function', () => {
      const expected = () => undefined;
      component.registerOnTouched(expected);

      expect(component.onTouched).toContain(expected);
    });
  });
});
