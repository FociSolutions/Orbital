import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeyValueRuleFormComponent, KeyValueRuleFormValues } from './key-value-rule-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as faker from 'faker';
import {
  KeyValueRuleItemFormComponent,
  KeyValueRuleItemFormValues,
} from './key-value-rule-item-form/key-value-rule-item-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { GetStringErrorsPipe } from '../../pipes/get-string-errors/get-string-errors.pipe';
import { Component, SimpleChanges, ViewChild } from '@angular/core';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule-type';

describe('KeyValueRuleFormComponent', () => {
  let wrapper: TestWrapperComponent;
  let component: KeyValueRuleFormComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  let SAMPLE_ITEM: KeyValueRuleItemFormValues;
  let SAMPLE_VALUE: KeyValueRuleFormValues;
  const VALUE_NULL: KeyValueRuleFormValues = [];

  @Component({
    selector: 'app-test-wrapper-component',
    template: '<app-key-value-rule-form [allowDuplicateKeys]="allowDuplicateKeys"></app-key-value-rule-form>',
  })
  class TestWrapperComponent {
    @ViewChild(KeyValueRuleFormComponent) child: KeyValueRuleFormComponent;
    allowDuplicateKeys = true;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        KeyValueRuleFormComponent,
        KeyValueRuleItemFormComponent,
        TestWrapperComponent,
        GetStringErrorsPipe,
      ],
      imports: [
        BrowserAnimationsModule,
        MatDividerModule,
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

    SAMPLE_ITEM = {
      key: faker.random.word(),
      value: faker.random.words(4),
      type: RuleType.JSONCONTAINS,
    };
    SAMPLE_VALUE = [SAMPLE_ITEM];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('KeyValueRuleFormComponent.writeValue', () => {
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

  describe('KeyValueRuleFormComponent validation', () => {
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

    it('should not fail validation if more than one entry has the same key but different value', () => {
      component.writeValue([SAMPLE_ITEM, { ...SAMPLE_ITEM, value: '1' }, { ...SAMPLE_ITEM, value: '2' }]);

      const actual = component.formArray.errors;
      expect(actual).toBeNull();
      expect(component.validate(null)).toBeNull();
    });

    describe('KeyValueRuleFormComponent validation allowDuplicateKeys', () => {
      it('should fail validation if allowDuplicateKeys is enabled and any entry is completely duplicated', () => {
        wrapper.allowDuplicateKeys = true;
        fixture.detectChanges();
        component.writeValue([SAMPLE_ITEM, SAMPLE_ITEM]);

        const actual = component.formArray.errors;
        expect(actual).toBeTruthy();
        expect(actual.duplicate).toBeTruthy();
        expect(component.validate(null)).toBeTruthy();
      });

      it('should not fail validation if allowDuplicateKeys is enabled and entries have the same keys with different values ', () => {
        wrapper.allowDuplicateKeys = true;
        fixture.detectChanges();
        component.writeValue([SAMPLE_ITEM, { ...SAMPLE_ITEM, value: '1' }, { ...SAMPLE_ITEM, value: '2' }]);

        const actual = component.formArray.errors;
        expect(actual).toBeNull();
        expect(component.validate(null)).toBeNull();
      });

      it('should fail validation if allowDuplicateKeys is disabled and entries have the same keys with different values ', () => {
        wrapper.allowDuplicateKeys = false;
        fixture.detectChanges();
        component.writeValue([SAMPLE_ITEM, { ...SAMPLE_ITEM, value: '1' }, { ...SAMPLE_ITEM, value: '2' }]);

        const actual = component.formArray.errors;
        expect(actual).toBeTruthy();
        expect(actual.duplicate).toBeTruthy();
        expect(component.validate(null)).toBeTruthy();
      });
    });
  });

  describe('KeyValueRuleFormComponent.setDisabledState', () => {
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

  describe('KeyValueRuleFormComponent.registerOnChange', () => {
    it('should set the onChange function', () => {
      const expected = () => undefined;
      component.registerOnChange(expected);

      expect(component.onChange).toContain(expected);
    });
  });

  describe('KeyValueRuleFormComponent.registerOnTouched', () => {
    it('should set the onTouched function', () => {
      const expected = () => undefined;
      component.registerOnTouched(expected);

      expect(component.onTouched).toContain(expected);
    });
  });

  describe('KeyValueRuleFormComponent.addItemHandler', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).cdRef = { detectChanges: jest.fn() };
    });

    it('should add an item to the list', () => {
      component.addItemHandler(SAMPLE_ITEM);

      expect(component.formArray.controls.length).toBe(1);
      expect(component.formArray.value).toEqual([SAMPLE_ITEM]);
    });

    it('should clear the add form when adding an item', () => {
      component.add.setValue(SAMPLE_ITEM);
      component.addItemHandler(SAMPLE_ITEM);

      expect(component.add.value).toBeNull();
    });

    it('should not add a duplicate item to the list', () => {
      component.addItemHandler(SAMPLE_ITEM);
      component.addItemHandler(SAMPLE_ITEM);

      expect(component.formArray.controls.length).toBe(1);
      expect(component.formArray.value).toEqual([SAMPLE_ITEM]);
    });

    it('should emit a duplicate item event when attempting to add an existing item', () => {
      const spy = jest.spyOn(component.itemIsDuplicatedEvent, 'emit');
      component.addItemHandler(SAMPLE_ITEM);
      component.addItemHandler(SAMPLE_ITEM);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(true);
      spy.mockRestore();
    });
  });

  describe('KeyValueRuleFormComponent.removeItemHandler', () => {
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

    it('should emit a duplicate item event when removing an item from the list', () => {
      component.addItemHandler(SAMPLE_ITEM);
      const spy = jest.spyOn(component.itemIsDuplicatedEvent, 'emit');
      component.removeItemHandler(0);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(false);
      spy.mockRestore();
    });
  });

  describe('KeyValueRuleFormComponent.ngOnChanges', () => {
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

  describe('KeyValueRuleFormComponent.touch', () => {
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
