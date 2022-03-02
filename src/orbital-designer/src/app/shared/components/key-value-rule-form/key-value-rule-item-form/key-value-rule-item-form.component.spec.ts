import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { KeyValueRuleItemFormComponent, KeyValueRuleItemFormValues } from './key-value-rule-item-form.component';
import * as faker from 'faker';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule-type';
import { Component, SimpleChanges, ViewChild } from '@angular/core';

describe('KeyValueRuleItemFormComponent', () => {
  let wrapper: TestWrapperComponent;
  let component: KeyValueRuleItemFormComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;
  let SAMPLE_VALUE: KeyValueRuleItemFormValues;
  const VALUE_NULL: KeyValueRuleItemFormValues = { key: null, value: null, type: null };

  @Component({
    selector: 'app-test-wrapper-component',
    template: '<app-key-value-rule-item-form [allowKeyWhitespace]="allowKeyWhitespace"></app-key-value-rule-item-form>',
  })
  class TestWrapperComponent {
    @ViewChild(KeyValueRuleItemFormComponent) child: KeyValueRuleItemFormComponent;
    allowKeyWhitespace = false;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KeyValueRuleItemFormComponent, TestWrapperComponent],
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
    fixture = TestBed.createComponent(TestWrapperComponent);
    fixture.detectChanges();
    wrapper = fixture.componentInstance;
    component = fixture.componentInstance.child;

    SAMPLE_VALUE = {
      key: faker.random.word(),
      value: faker.random.words(4),
      type: RuleType.JSONCONTAINS,
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('KeyValueRuleItemFormComponent.writeValue', () => {
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

  describe('KeyValueRuleItemFormComponent validation', () => {
    it('should not fail validation with valid inputs', () => {
      component.writeValue(SAMPLE_VALUE);

      const actual = component.validate(component.key);
      expect(actual).toBeNull();
    });

    it('should fail validation if the key field is empty', () => {
      const value: KeyValueRuleItemFormValues = { ...SAMPLE_VALUE, key: null };
      component.writeValue(value);

      const actual = component.key.validator(component.key);
      expect(actual).toBeTruthy();
      expect(actual.required).toBeTruthy();
      expect(component.validate(null)).toBeTruthy();
    });

    it('should fail validation if the key field exceeds its maxlength', () => {
      const value: KeyValueRuleItemFormValues = {
        ...SAMPLE_VALUE,
        key: faker.helpers.repeatString('x', component.keyMaxLength + 1),
      };
      component.writeValue(value);

      const actual = component.key.validator(component.key);
      expect(actual).toBeTruthy();
      expect(actual.maxlength).toBeTruthy();
      expect(component.validate(null)).toBeTruthy();
    });

    it('should fail validation if allowKeyWhitespace is `false` and the key field contains a space empty', () => {
      const value: KeyValueRuleItemFormValues = { ...SAMPLE_VALUE, key: 'has a space' };
      wrapper.allowKeyWhitespace = false;
      fixture.detectChanges();
      component.writeValue(value);

      const actual = component.key.validator(component.key);
      expect(actual).toBeTruthy();
      expect(actual.whitespace).toBeTruthy();
      expect(component.validate(null)).toBeTruthy();
    });

    it('should not fail validation if allowKeyWhitespace is `true` and the key field contains a space empty', () => {
      const value: KeyValueRuleItemFormValues = { ...SAMPLE_VALUE, key: 'has a space' };
      wrapper.allowKeyWhitespace = true;
      fixture.detectChanges();
      component.writeValue(value);

      const actual = component.key.validator(component.key);
      expect(actual).toBeNull();
      expect(component.validate(null)).toBeNull();
    });

    it('should fail validation if the value field is empty', () => {
      const value: KeyValueRuleItemFormValues = { ...SAMPLE_VALUE, value: null };
      component.writeValue(value);

      const actual = component.value.validator(component.value);
      expect(actual).toBeTruthy();
      expect(actual.required).toBeTruthy();
      expect(component.validate(null)).toBeTruthy();
    });

    it('should fail validation if the value field exceeds its maxlength', () => {
      const value: KeyValueRuleItemFormValues = {
        ...SAMPLE_VALUE,
        value: faker.helpers.repeatString('x', component.valueMaxLength + 1),
      };
      component.writeValue(value);

      const actual = component.value.validator(component.value);
      expect(actual).toBeTruthy();
      expect(actual.maxlength).toBeTruthy();
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

  describe('KeyValueRuleItemFormComponent.setDisabledState', () => {
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

  describe('KeyValueRuleItemFormComponent.registerOnChange', () => {
    it('should add an onChange function', () => {
      const expected = () => undefined;
      component.registerOnChange(expected);

      expect(component.onChange).toContain(expected);
    });
  });

  describe('KeyValueRuleItemFormComponent.registerOnTouched', () => {
    it('should add an onChange function', () => {
      const expected = () => undefined;
      component.registerOnTouched(expected);

      expect(component.onTouched).toContain(expected);
    });
  });

  describe('KeyValueRuleItemFormComponent.noWhiteSpaceValidator', () => {
    it('should return null if the value contains no white space', () => {
      const control = { value: faker.random.word() } as AbstractControl;
      const actual = KeyValueRuleItemFormComponent.noWhiteSpaceValidator(control);

      expect(actual).toBeNull();
    });

    it('should return an error object if the value contains whitespace', () => {
      const control = { value: faker.random.words(2) } as AbstractControl;
      const actual = KeyValueRuleItemFormComponent.noWhiteSpaceValidator(control);

      expect(actual).toBeTruthy();
      expect(actual.whitespace).toBeTruthy();
    });
  });

  describe('KeyValueRuleItemFormComponent.ngOnChanges', () => {
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

  describe('KeyValueRuleItemFormComponent.touch', () => {
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
