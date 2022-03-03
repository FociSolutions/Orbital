import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BodyRuleFormComponent, BodyRuleFormValues } from './body-rule-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as faker from 'faker';
import { BodyRuleItemFormComponent, BodyRuleItemFormValues } from './body-rule-item-form/body-rule-item-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { GetStringErrorsPipe } from '../../../shared/pipes/get-string-errors/get-string-errors.pipe';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule-type';
import { MatCardModule } from '@angular/material/card';
import { SimpleChanges } from '@angular/core';

describe('BodyRuleFormComponent', () => {
  let component: BodyRuleFormComponent;
  let fixture: ComponentFixture<BodyRuleFormComponent>;
  let SAMPLE_ITEM: BodyRuleItemFormValues;
  const NULL_ITEM: BodyRuleItemFormValues = {
    type: null,
    value: null,
  };
  let SAMPLE_VALUE: BodyRuleFormValues;
  const VALUE_NULL: BodyRuleFormValues = [];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BodyRuleFormComponent, BodyRuleItemFormComponent, GetStringErrorsPipe],
      imports: [
        BrowserAnimationsModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyRuleFormComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;

    SAMPLE_ITEM = {
      type: RuleType.TEXTEQUALS,
      value: faker.random.words(4),
    };
    SAMPLE_VALUE = [SAMPLE_ITEM];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('BodyRuleFormComponent.writeValue', () => {
    it('should set the values for the form fields', () => {
      component.writeValue(SAMPLE_VALUE);
      expect(component.formArray.value).toEqual(SAMPLE_VALUE);
    });

    it('should clear the values in the form when null is passed in', () => {
      component.writeValue(null);

      expect(component.formArray.value).toEqual(VALUE_NULL);
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

  describe('BodyRuleFormComponent validation', () => {
    it('should not fail validation with valid inputs', () => {
      component.writeValue(SAMPLE_VALUE);

      const actual = component.validate(null);
      expect(actual).toBeNull();
    });

    it('should not fail validation with no inputs', () => {
      component.writeValue(VALUE_NULL);

      const actual = component.validate(null);
      expect(actual).toBeNull();
    });

    it('should fail validation if any entry is duplicated', () => {
      component.writeValue([SAMPLE_ITEM, SAMPLE_ITEM]);

      const actual = component.formArray.errors;
      expect(actual).toBeTruthy();
      expect(actual.duplicate).toBeTruthy();
      expect(component.validate(null)).toBeTruthy();
    });
  });

  describe('BodyRuleFormComponent.setDisabledState', () => {
    it('should set the disabled state to true on all the controls in the form group', () => {
      component.setDisabledState(true);
      expect(Object.values(component.formArray.controls).every((x) => x.disabled && !x.enabled)).toBe(true);
    });

    it('should set the disabled state to false on all the controls in the form group', () => {
      component.setDisabledState(true);
      component.setDisabledState(false);
      expect(Object.values(component.formArray.controls).every((x) => !x.disabled && x.enabled)).toBe(true);
    });
  });

  describe('BodyRuleFormComponent.registerOnChange', () => {
    it('should set the onChange function', () => {
      const expected = () => undefined;
      component.registerOnChange(expected);

      expect(component.onChange).toContain(expected);
    });
  });

  describe('BodyRuleFormComponent.registerOnTouched', () => {
    it('should set the onTouched function', () => {
      const expected = () => undefined;
      component.registerOnTouched(expected);

      expect(component.onTouched).toContain(expected);
    });
  });

  describe('BodyRuleFormComponent.addItem', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).cdRef = { detectChanges: jest.fn() };
    });

    it('should add an item to the list', () => {
      component.addItemHandler(NULL_ITEM);

      expect(component.formArray.controls.length).toBe(1);
      expect(component.formArray.value).toEqual([NULL_ITEM]);
    });
  });

  describe('BodyRuleFormComponent.removeItemHandler', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).cdRef = { detectChanges: jest.fn() };
    });

    it('should remove an item from the list', () => {
      component.addItemHandler(SAMPLE_ITEM);
      component.removeItemHandler(0);

      expect(component.formArray.controls.length).toBe(0);
      expect(component.formArray.value).toEqual([]);
    });

    it('should throw an error if the requested index is out of bounds', () => {
      component.addItemHandler(SAMPLE_ITEM);
      expect(() => component.removeItemHandler(-1)).toThrow();
      expect(() => component.removeItemHandler(1)).toThrow();
      expect(() => component.removeItemHandler(2)).toThrow();
    });

    it('should throw an error if the list is empty', () => {
      expect(() => component.removeItemHandler(-1)).toThrow();
      expect(() => component.removeItemHandler(0)).toThrow();
      expect(() => component.removeItemHandler(1)).toThrow();
    });
  });

  describe('BodyRuleFormComponent.ngOnChanges', () => {
    it('should mark the formArray as touched if the touched input is true and not the firstChange', () => {
      const changes: SimpleChanges = {
        touched: {
          isFirstChange: () => false,
          firstChange: false,
          previousValue: undefined,
          currentValue: true,
        },
      };
      component.ngOnChanges(changes);

      expect(component.formArray.touched).toBe(true);
    });

    it('should not mark the formArray as touched if the touched input is false and not the firstChange', () => {
      const changes: SimpleChanges = {
        touched: {
          isFirstChange: () => false,
          firstChange: false,
          previousValue: undefined,
          currentValue: false,
        },
      };
      component.ngOnChanges(changes);

      expect(component.formArray.touched).toBe(false);
    });

    it('should not mark the formArray as touched if the input is the firstChange', () => {
      const changes: SimpleChanges = {
        touched: {
          isFirstChange: () => true,
          firstChange: true,
          previousValue: undefined,
          currentValue: true,
        },
      };
      component.ngOnChanges(changes);

      expect(component.formArray.touched).toBe(false);
    });

    it('should not mark the formArray as touched if the input does not contain the touched change', () => {
      const changes: SimpleChanges = {};
      component.ngOnChanges(changes);

      expect(component.formArray.touched).toBe(false);
    });
  });

  describe('BodyRuleFormComponent.touch', () => {
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
