import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetadataFormComponent, MetadataFormValues } from './metadata-form.component';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as faker from 'faker';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { SimpleChanges } from '@angular/core';

describe('MetadataFormComponent', () => {
  let component: MetadataFormComponent;
  let fixture: ComponentFixture<MetadataFormComponent>;
  let SAMPLE_VALUE: MetadataFormValues;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MetadataFormComponent],
      imports: [BrowserAnimationsModule, MatInputModule, ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    SAMPLE_VALUE = {
      title: faker.random.words(2).substring(0, component.title_maxlength),
      description: faker.random.words(8).substring(0, component.description_maxlength),
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('MetadataFormComponent.writeValue', () => {
    it('should set the values for the form fields', () => {
      component.writeValue(SAMPLE_VALUE);
      expect(component.form.value).toEqual(SAMPLE_VALUE);
    });

    it('should clear the values in the form when null is passed in', () => {
      const value: MetadataFormValues = {
        title: null as unknown as string,
        description: null as unknown as string,
      };
      component.writeValue(null);

      expect(component.form.value).toEqual(value);
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

  describe('MetadataFormComponent validation', () => {
    it('should not fail validation with valid inputs', () => {
      component.writeValue(SAMPLE_VALUE);

      const actual = component.validate(component.title);
      expect(actual).toBeNull();
    });

    it('should fail validation if the title field is empty', () => {
      const value: MetadataFormValues = { ...SAMPLE_VALUE, title: '' };
      component.writeValue(value);

      const actual = component.title.validator?.(component.title);
      expect(actual).toBeTruthy();
      expect(actual?.required).toBeTruthy();
      expect(component.validate(null as unknown as FormControl)).toBeTruthy();
    });

    it('should fail validation if the title field contains only whitespace', () => {
      const value: MetadataFormValues = { ...SAMPLE_VALUE, title: '     ' };
      component.writeValue(value);

      const actual = component.title.validator?.(component.title);
      expect(actual).toBeTruthy();
      expect(actual?.whitespace).toBeTruthy();
      expect(component.validate(null as unknown as FormControl)).toBeTruthy();
    });

    it('should fail validation if the title field has more than the max characters', () => {
      const value: MetadataFormValues = {
        ...SAMPLE_VALUE,
        title: faker.helpers.repeatString('x', component.title_maxlength + 1),
      };
      component.writeValue(value);

      const actual = component.title.validator?.(component.title);
      expect(actual).toBeTruthy();
      expect(actual?.maxlength).toBeTruthy();
      expect(component.validate(null as unknown as FormControl)).toBeTruthy();
    });

    it('should fail validation if the description field has more than the max characters', () => {
      const value: MetadataFormValues = {
        ...SAMPLE_VALUE,
        description: faker.helpers.repeatString('x', component.description_maxlength + 1),
      };
      component.writeValue(value);

      const actual = component.description.validator?.(component.description);
      expect(actual).toBeTruthy();
      expect(actual?.maxlength).toBeTruthy();
      expect(component.validate(null as unknown as FormControl)).toBeTruthy();
    });

    it('should not fail validation if the description field is empty', () => {
      const value: MetadataFormValues = { ...SAMPLE_VALUE, description: '' };
      component.writeValue(value);

      const actual = component.description.validator?.(component.description);
      expect(actual).toBeNull();
      expect(component.validate(null as unknown as FormControl)).toBeNull();
    });
  });

  describe('MetadataFormComponent.setDisabledState', () => {
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

  describe('MetadataFormComponent.registerOnChange', () => {
    it('should set the onChange function', () => {
      const expected = () => undefined;
      component.registerOnChange(expected);

      expect(component.onChange).toContain(expected);
    });
  });

  describe('MetadataFormComponent.registerOnTouched', () => {
    it('should set the onTouched function', () => {
      const expected = () => undefined;
      component.registerOnTouched(expected);

      expect(component.onTouched).toContain(expected);
    });
  });

  describe('MetadataFormComponent.ngOnChanges', () => {
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

  describe('MetadataFormComponent.touch', () => {
    it('should execute the onTouched callbacks', () => {
      const spy = jest.fn();
      component.registerOnTouched(spy);
      component.touch();

      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });
  });

  describe('MetadataFormComponent.notOnlyWhiteSpaceValidator', () => {
    it('should return null if the input contains more than white space', () => {
      const control = { value: faker.random.word() } as AbstractControl;
      const actual = MetadataFormComponent.notOnlyWhiteSpaceValidator(control);

      expect(actual).toBeNull();
    });

    it('should return null if the input is empty', () => {
      const control = { value: '' } as AbstractControl;
      const actual = MetadataFormComponent.notOnlyWhiteSpaceValidator(control);

      expect(actual).toBeNull();
    });

    it('should return null if the input is null', () => {
      const control = { value: null } as AbstractControl;
      const actual = MetadataFormComponent.notOnlyWhiteSpaceValidator(control);

      expect(actual).toBeNull();
    });

    it('should return an error object if the string contains only whitespace', () => {
      const control = { value: '  ' } as AbstractControl;
      const actual = MetadataFormComponent.notOnlyWhiteSpaceValidator(control);

      expect(actual).toBeTruthy();
      expect(actual?.whitespace).toBeTruthy();
    });
  });
});
