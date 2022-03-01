import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoliciesFormComponent, PoliciesFormValues } from './policies-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as faker from 'faker';
import { PolicyFormComponent } from './policy-form/policy-form.component';
import { PolicyType } from 'src/app/models/mock-definition/scenario/policy-type';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DelayResponsePolicy } from 'src/app/models/mock-definition/scenario/policy.model';
import { GetStringErrorsPipe } from 'src/app/shared/pipes/get-string-errors/get-string-errors.pipe';

describe('PoliciesFormComponent', () => {
  let component: PoliciesFormComponent;
  let fixture: ComponentFixture<PoliciesFormComponent>;
  let SAMPLE_VALUE: PoliciesFormValues;
  const VALUE_NULL: PoliciesFormValues = [];
  const DELAY_POLICY: DelayResponsePolicy = {
    type: PolicyType.DELAY_RESPONSE,
    value: faker.datatype.number({ min: 1000, max: 9999, precision: 1 }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoliciesFormComponent, PolicyFormComponent, GetStringErrorsPipe],
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
    fixture = TestBed.createComponent(PoliciesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    SAMPLE_VALUE = [DELAY_POLICY];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('PoliciesFormComponent.writeValue', () => {
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

  describe('PoliciesFormComponent validation', () => {
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
      component.writeValue([DELAY_POLICY, DELAY_POLICY]);

      const actual = component.formArray.errors;
      expect(actual).toBeTruthy();
      expect(actual.duplicate).toBeTruthy();
      expect(component.validate(null)).toBeTruthy();
    });

    it('should fail validation if there is more than one delay policy', () => {
      component.writeValue([DELAY_POLICY, DELAY_POLICY]);

      const actual = component.formArray.errors;
      expect(actual).toBeTruthy();
      expect(actual.duplicate).toBeTruthy();
      expect(component.validate(null)).toBeTruthy();
    });
  });

  describe('PoliciesFormComponent.setDisabledState', () => {
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

  describe('PoliciesFormComponent.registerOnChange', () => {
    it('should set the onChange function', () => {
      const expected = () => undefined;
      component.registerOnChange(expected);

      expect(component.onChange).toContain(expected);
    });
  });

  describe('PoliciesFormComponent.registerOnTouched', () => {
    it('should set the onTouched function', () => {
      const expected = () => undefined;
      component.registerOnTouched(expected);

      expect(component.onTouched).toContain(expected);
    });
  });

  describe('PoliciesFormComponent.addPolicyHandler', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).cdRef = { detectChanges: jest.fn() };
    });

    it('should add a policy to the list', () => {
      component.addPolicyHandler(DELAY_POLICY);

      expect(component.formArray.controls.length).toBe(1);
      expect(component.formArray.value).toEqual([DELAY_POLICY]);
    });

    it('should clear the add form when adding a policy', () => {
      component.add.setValue(DELAY_POLICY);
      component.addPolicyHandler(DELAY_POLICY);

      expect(component.add.value).toBeNull();
    });

    it('should not add a duplicate policy to the list', () => {
      component.addPolicyHandler(DELAY_POLICY);
      component.addPolicyHandler(DELAY_POLICY);

      expect(component.formArray.controls.length).toBe(1);
      expect(component.formArray.value).toEqual([DELAY_POLICY]);
    });

    it('should emit a duplicate policy event when attempting to add an existing policy', () => {
      const spy = jest.spyOn(component.policyIsDuplicatedEvent, 'emit');
      component.addPolicyHandler(DELAY_POLICY);
      component.addPolicyHandler(DELAY_POLICY);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(true);
      spy.mockRestore();
    });
  });

  describe('PoliciesFormComponent.removePolicyHandler', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).cdRef = { detectChanges: jest.fn() };
    });

    it('should remove a policy from a list', () => {
      component.addPolicyHandler(DELAY_POLICY);
      component.removePolicyHandler(0);

      expect(component.formArray.controls.length).toBe(0);
      expect(component.formArray.value).toEqual([]);
    });

    it('should throw an error if the requested index is out of bounds', () => {
      component.addPolicyHandler(DELAY_POLICY);
      expect(() => component.removePolicyHandler(-1)).toThrow();
      expect(() => component.removePolicyHandler(1)).toThrow();
      expect(() => component.removePolicyHandler(2)).toThrow();
    });

    it('should throw an error if the list is empty', () => {
      expect(() => component.removePolicyHandler(-1)).toThrow();
      expect(() => component.removePolicyHandler(0)).toThrow();
      expect(() => component.removePolicyHandler(1)).toThrow();
    });

    it('should emit a duplicate policy event when removing a policy from a list', () => {
      component.addPolicyHandler(DELAY_POLICY);
      const spy = jest.spyOn(component.policyIsDuplicatedEvent, 'emit');
      component.removePolicyHandler(0);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(false);
      spy.mockRestore();
    });
  });
});
