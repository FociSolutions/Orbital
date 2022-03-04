import { TestBed } from '@angular/core/testing';
import { ValidJsonService } from './valid-json.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';

describe('ValidJsonService', () => {
  let service: ValidJsonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
    service = TestBed.inject(ValidJsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('ValidJsonService.getValidator', () => {
    it('should return a function', () => {
      expect(typeof ValidJsonService.getValidator()).toBe('function');
      expect(typeof ValidJsonService.getValidator(true)).toBe('function');
      expect(typeof ValidJsonService.getValidator(false)).toBe('function');
    });

    describe('ValidJsonService.getValidator(required = true)', () => {
      let validator: ValidatorFn;

      beforeEach(() => {
        validator = ValidJsonService.getValidator();
      });

      it('should return null if the value is valid', () => {
        const control = { value: '{ "test": "value" }' } as AbstractControl;
        const actual = validator(control);

        expect(actual).toBeNull();
      });

      it('should return an error if the value is null', () => {
        const control = { value: null } as AbstractControl;
        const actual = validator(control);

        expect(actual).toBeTruthy();
        expect(actual?.required).toBeTruthy();
      });

      it('should return an error if the value is an empty string', () => {
        const control = { value: '' } as AbstractControl;
        const actual = validator(control);

        expect(actual).toBeTruthy();
        expect(actual?.required).toBeTruthy();
      });

      it('should return an error if the top-level object has no keys', () => {
        const control = { value: '{}' } as AbstractControl;
        const actual = validator(control);

        expect(actual).toBeTruthy();
        expect(actual?.empty).toBeTruthy();
      });

      it('should return an error if input is not valid json', () => {
        const control = { value: 'not_json' } as AbstractControl;
        const actual = validator(control);

        expect(actual).toBeTruthy();
        expect(actual?.invalid).toBeTruthy();
      });

      it('should return an error if the top level type is a string', () => {
        const control = { value: '"a_string"' } as AbstractControl;
        const actual = validator(control);

        expect(actual).toBeTruthy();
        expect(actual?.top_level_object).toBeTruthy();
      });

      it('should return an error if the top level type is a number', () => {
        const control = { value: '1' } as AbstractControl;
        const actual = validator(control);

        expect(actual).toBeTruthy();
        expect(actual?.top_level_object).toBeTruthy();
      });

      it('should return an error if the top level type is a boolean', () => {
        const control = { value: 'true' } as AbstractControl;
        const actual = validator(control);

        expect(actual).toBeTruthy();
        expect(actual?.top_level_object).toBeTruthy();
      });

      it('should return an error if the top level type is null', () => {
        const control = { value: 'null' } as AbstractControl;
        const actual = validator(control);

        expect(actual).toBeTruthy();
        expect(actual?.top_level_object).toBeTruthy();
      });

      it('should return an error if the top level type is an array', () => {
        const control = { value: '[]' } as AbstractControl;
        const actual = validator(control);

        expect(actual).toBeTruthy();
        expect(actual?.top_level_object).toBeTruthy();
      });
    });

    describe('ValidJsonService.getValidator(required = false)', () => {
      let validator: ValidatorFn;

      beforeEach(() => {
        validator = ValidJsonService.getValidator(false);
      });

      it('should return null if the value is valid', () => {
        const control = { value: '{ "test": "value" }' } as AbstractControl;
        const actual = validator(control);

        expect(actual).toBeNull();
      });

      it('should return null if the value is null', () => {
        const control = { value: null } as AbstractControl;
        const actual = validator(control);

        expect(actual).toBeNull();
      });

      it('should return null if the value is an empty string', () => {
        const control = { value: '' } as AbstractControl;
        const actual = validator(control);

        expect(actual).toBeNull();
      });

      it('should return null if the top-level object has no keys', () => {
        const control = { value: '{}' } as AbstractControl;
        const actual = validator(control);

        expect(actual).toBeNull();
      });

      it('should return an error if input is not valid json', () => {
        const control = { value: 'not_json' } as AbstractControl;
        const actual = validator(control);

        expect(actual).toBeTruthy();
        expect(actual?.invalid).toBeTruthy();
      });

      it('should return an error if the top level type is a string', () => {
        const control = { value: '"a_string"' } as AbstractControl;
        const actual = validator(control);

        expect(actual).toBeTruthy();
        expect(actual?.top_level_object).toBeTruthy();
      });

      it('should return an error if the top level type is a number', () => {
        const control = { value: '1' } as AbstractControl;
        const actual = validator(control);

        expect(actual).toBeTruthy();
        expect(actual?.top_level_object).toBeTruthy();
      });

      it('should return an error if the top level type is a boolean', () => {
        const control = { value: 'true' } as AbstractControl;
        const actual = validator(control);

        expect(actual).toBeTruthy();
        expect(actual?.top_level_object).toBeTruthy();
      });

      it('should return an error if the top level type is null', () => {
        const control = { value: 'null' } as AbstractControl;
        const actual = validator(control);

        expect(actual).toBeTruthy();
        expect(actual?.top_level_object).toBeTruthy();
      });

      it('should return an error if the top level type is an array', () => {
        const control = { value: '[]' } as AbstractControl;
        const actual = validator(control);

        expect(actual).toBeTruthy();
        expect(actual?.top_level_object).toBeTruthy();
      });
    });
  });
});
