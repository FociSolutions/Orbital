import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BodyRuleItemFormComponent, BodyRuleItemFormValues } from './body-rule-item-form.component';
import { faker } from '@faker-js/faker';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule-type';
import { BodyRuleType, InternalBodyRuleItemFormValues, TextRuleCondition } from './body-rule-item-form.types';
import { SimpleChanges } from '@angular/core';

describe('BodyRuleItemFormComponent', () => {
  let component: BodyRuleItemFormComponent;
  let fixture: ComponentFixture<BodyRuleItemFormComponent>;
  let SAMPLE_VALUE: BodyRuleItemFormValues;
  let INT_SAMPLE_VALUE: InternalBodyRuleItemFormValues;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BodyRuleItemFormComponent],
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
    fixture = TestBed.createComponent(BodyRuleItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    SAMPLE_VALUE = {
      type: RuleType.TEXTEQUALS,
      value: faker.random.words(4),
    };
    INT_SAMPLE_VALUE = {
      value: SAMPLE_VALUE.value,
      ruleType: BodyRuleType.TEXT,
      ruleCondition: TextRuleCondition.EQUALS,
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('BodyRuleItemFormComponent.writeValue', () => {
    it('should set the values for the form fields', () => {
      component.writeValue(SAMPLE_VALUE);
      expect(component.form.value).toEqual(INT_SAMPLE_VALUE);
    });

    it('should clear the values in the form when null is passed in', () => {
      component.writeValue(null);

      expect(component.form.value).toEqual({ ...component.defaults, ruleCondition: undefined });
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

  describe('BodyRuleItemFormComponent validation', () => {
    it('should not fail validation with valid inputs', () => {
      component.writeValue(SAMPLE_VALUE);

      const actual = component.validate(component.value);
      expect(actual).toBeNull();
    });

    it('should fail validation if the ruleType field is empty', () => {
      const value: BodyRuleItemFormValues = { ...SAMPLE_VALUE, type: null as unknown as RuleType };
      component.writeValue(value);

      const actual = component.ruleType.validator?.(component.ruleType);
      expect(actual).toBeTruthy();
      expect(actual?.required).toBeTruthy();
      expect(component.validate(null as unknown as FormControl)).toBeTruthy();
    });

    it('should fail validation if the ruleCondition field is empty', () => {
      const value: BodyRuleItemFormValues = { ...SAMPLE_VALUE, type: null as unknown as RuleType };
      component.writeValue(value);

      const actual = component.ruleCondition.validator?.(component.ruleCondition);
      expect(actual).toBeTruthy();
      expect(actual?.required).toBeTruthy();
      expect(component.validate(null as unknown as FormControl)).toBeTruthy();
    });

    it('should fail validation if the value field is empty', () => {
      const value: BodyRuleItemFormValues = { ...SAMPLE_VALUE, value: null as unknown as string };
      component.writeValue(value);

      const actual = component.value.validator?.(component.value);
      expect(actual).toBeTruthy();
      expect(actual?.required).toBeTruthy();
      expect(component.validate(null as unknown as FormControl)).toBeTruthy();
    });

    it('should fail validation if the entry is duplicated', () => {
      component.writeValue(SAMPLE_VALUE);
      component.itemIsDuplicatedEvent.emit(true);

      const actual = component.form.errors;
      expect(actual).toBeTruthy();
      expect(actual?.duplicate).toBeTruthy();
      expect(component.validate(null as unknown as FormControl)).toBeTruthy();
    });
  });

  describe('BodyRuleItemFormComponent.getExternalRuleType', () => {
    it('should return the correct RuleType for a sample input', () => {
      const actual = component.getExternalRuleType(INT_SAMPLE_VALUE);

      expect(actual).toBe(RuleType.TEXTEQUALS);
    });

    it('should return null when the input is null', () => {
      const actual = component.getExternalRuleType(null);

      expect(actual).toBe(null);
    });
  });

  describe('BodyRuleItemFormComponent.getInternalRuleType', () => {
    it('should return the correct RuleType for a sample input', () => {
      const actual = component.getInternalRuleType(SAMPLE_VALUE.type);
      const { value: _, ...expected } = INT_SAMPLE_VALUE;

      expect(actual).toEqual(expected);
    });
  });

  describe('BodyRuleItemFormComponent.adaptInternalFormatToExternal', () => {
    it('should convert a value properly', () => {
      const actual = component.adaptInternalFormatToExternal(INT_SAMPLE_VALUE);

      expect(actual).toEqual(SAMPLE_VALUE);
    });

    it('should convert null properly', () => {
      const actual = component.adaptInternalFormatToExternal(null);

      expect(actual).toBeNull();
    });
  });

  describe('BodyRuleItemFormComponent.adaptExternalFormatToInternal', () => {
    it('should convert a value properly', () => {
      const actual = component.adaptExternalFormatToInternal(SAMPLE_VALUE);

      expect(actual).toEqual(INT_SAMPLE_VALUE);
    });

    it('should convert null properly', () => {
      const actual = component.adaptExternalFormatToInternal(null);

      expect(actual).toBeNull();
    });
  });

  describe('BodyRuleItemFormComponent.safeParseJson', () => {
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

  describe('BodyRuleItemFormComponent.setDisabledState', () => {
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

  describe('BodyRuleItemFormComponent.registerOnChange', () => {
    it('should set the onChange function', () => {
      const expected = () => undefined;
      component.registerOnChange(expected);

      expect(component.onChange).toContain(expected);
    });
  });

  describe('BodyRuleItemFormComponent.registerOnTouched', () => {
    it('should set the onTouched function', () => {
      const expected = () => undefined;
      component.registerOnTouched(expected);

      expect(component.onTouched).toContain(expected);
    });
  });

  describe('BodyRuleItemFormComponent.registerOnValidatorChange', () => {
    it('should set the onValidatorChange function', () => {
      const expected = () => undefined;
      component.registerOnValidatorChange(expected);

      expect(component.onValidationChange).toContain(expected);
    });
  });

  describe('BodyRuleItemFormComponent.ngOnChanges', () => {
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

  describe('BodyRuleItemFormComponent.touch', () => {
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
