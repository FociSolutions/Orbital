import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { UrlRuleItemFormComponent, UrlRuleItemFormValues } from './url-rule-item-form.component';
import * as faker from 'faker';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule-type';
import { SimpleChanges } from '@angular/core';

describe('UrlRuleItemFormComponent', () => {
  let component: UrlRuleItemFormComponent;
  let fixture: ComponentFixture<UrlRuleItemFormComponent>;
  let SAMPLE_VALUE: UrlRuleItemFormValues;
  const VALUE_NULL: UrlRuleItemFormValues = { type: null, path: undefined };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UrlRuleItemFormComponent],
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
    fixture = TestBed.createComponent(UrlRuleItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    SAMPLE_VALUE = {
      type: RuleType.TEXTEQUALS,
      path: faker.random.words(4),
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('UrlRuleItemFormComponent.writeValue', () => {
    it('should set the values for the form fields', () => {
      component.writeValue(SAMPLE_VALUE);
      expect(component.form.value).toEqual(SAMPLE_VALUE);
    });

    it('should clear the values in the form when null is passed in', () => {
      component.writeValue(null);

      expect(component.form.value).toEqual(VALUE_NULL);
    });

    it('should notify of a change when called', () => {
      const spy = jest.fn();
      component.registerOnChange(spy);

      component.writeValue(SAMPLE_VALUE);
      component.writeValue(null);

      expect(spy).toHaveBeenCalledTimes(2);
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

    it('should not notify of a touch or change when called with null to reset the form', () => {
      const spy = jest.fn();
      const spy2 = jest.fn();
      component.registerOnChange(spy);
      component.registerOnTouched(spy);

      component.writeValue(null);

      expect(spy).toHaveBeenCalledTimes(0);
      expect(spy2).toHaveBeenCalledTimes(0);
      spy.mockRestore();
      spy2.mockRestore();
    });
  });

  describe('UrlRuleItemFormComponent validation', () => {
    it('should not fail validation with valid inputs', () => {
      component.writeValue(SAMPLE_VALUE);

      const actual = component.validate(component.type);
      expect(actual).toBeNull();
    });

    it('should fail validation if the type field is empty', () => {
      const value: UrlRuleItemFormValues = { ...SAMPLE_VALUE, type: null };
      component.writeValue(value);

      const actual = component.type.validator(component.type);
      expect(actual).toBeTruthy();
      expect(actual.required).toBeTruthy();
      expect(component.validate(null)).toBeTruthy();
    });

    it('should fail validation if the path field is empty', () => {
      const value: UrlRuleItemFormValues = { ...SAMPLE_VALUE, path: null };
      component.writeValue(value);

      const actual = component.path.validator(component.path);
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

  describe('UrlRuleItemFormComponent.adjustFormValue', () => {
    it('should set the path to an empty string if the RuleType is set to ACCEPTALL', () => {
      const value: UrlRuleItemFormValues = { ...SAMPLE_VALUE, type: RuleType.ACCEPTALL };
      const actual = component.adjustFormValue(value);

      expect(actual.path).toBe('');
    });

    it('should set the path to an empty string if the path is null', () => {
      const value: UrlRuleItemFormValues = { ...SAMPLE_VALUE, path: null };
      const actual = component.adjustFormValue(value);

      expect(actual.path).toBe('');
    });

    it('should set the path to an empty string if the path is undefined', () => {
      const value: UrlRuleItemFormValues = { ...SAMPLE_VALUE, path: undefined };
      const actual = component.adjustFormValue(value);

      expect(actual.path).toBe('');
    });
  });

  describe('UrlRuleItemFormComponent.handleDisablingPathField', () => {
    it('should save the path value and disable the path field if it is enabled and the type is ACCEPTALL', () => {
      component.writeValue(SAMPLE_VALUE);
      expect(component.path.enabled).toBe(true);

      component.writeValue({ type: RuleType.ACCEPTALL });
      expect(component.path.disabled).toBe(true);
      expect(component.path.value).toBe(SAMPLE_VALUE.path);
    });

    it('should save the path value and disable the path field if it is enabled and the type is null', () => {
      component.writeValue(SAMPLE_VALUE);
      expect(component.path.enabled).toBe(true);

      component.writeValue({ type: null });
      expect(component.path.disabled).toBe(true);
      expect(component.path.value).toBe(SAMPLE_VALUE.path);
    });

    it('should restore the path value and enable the path field if it is disabled and the type is valid', () => {
      component.writeValue(SAMPLE_VALUE);
      expect(component.path.enabled).toBe(true);

      component.writeValue({ type: RuleType.ACCEPTALL });
      fixture.detectChanges();
      expect(component.path.disabled).toBe(true);
      expect(component.form.value.path).toBe(undefined);

      component.writeValue({ type: RuleType.TEXTEQUALS });
      expect(component.path.enabled).toBe(true);
      expect(component.path.value).toBe(SAMPLE_VALUE.path);
    });
  });

  describe('UrlRuleItemFormComponent.setDisabledState', () => {
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

  describe('UrlRuleItemFormComponent.registerOnChange', () => {
    it('should set the onChange function', () => {
      const expected = () => undefined;
      component.registerOnChange(expected);

      expect(component.onChange).toContain(expected);
    });
  });

  describe('UrlRuleItemFormComponent.registerOnTouched', () => {
    it('should set the onTouched function', () => {
      const expected = () => undefined;
      component.registerOnTouched(expected);

      expect(component.onTouched).toContain(expected);
    });
  });

  describe('UrlRuleItemFormComponent.ngOnChanges', () => {
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

  describe('UrlRuleItemFormComponent.touch', () => {
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
