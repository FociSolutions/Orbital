import { extendBuiltInValidatorFactory } from './extend-built-in-validator-factory';
import { Validators, FormControl } from '@angular/forms';

describe('extendBuiltInValidatorFactory', () => {
  let validatorFn;
  describe('extendBuiltInValidatorFactory(Validators.required)', () => {
    beforeEach(() => {
      validatorFn = extendBuiltInValidatorFactory(Validators.required);
    });
    it(`should return a validator function that modifies the return of the
    Validators.required validator function to contain a string instead of a boolean`, async () => {
      const result = await validatorFn(new FormControl());
      expect(typeof result.required === 'string').toBeTruthy();
    });

    it('should still return null if no errors where found', async () => {
      const result = await validatorFn(new FormControl('not empty'));
      expect(result).toBeNull();
    });
  });

  describe('extendBuiltInValidatorFactory(Validators.maxlength', () => {
    beforeEach(() => {
      validatorFn = extendBuiltInValidatorFactory(Validators.maxLength(1));
    });
    it(`should return a validator function that modifies the return of the
    Validators.maxlength validator function to contain a string instead of an object`, async () => {
      const result = await validatorFn(new FormControl('invalid string'));
      expect(typeof result.maxlength === 'string').toBeTruthy();
    });

    it('should still return null if no errors where found', async () => {
      const result = await validatorFn(new FormControl(''));
      expect(result).toBeNull();
    });
  });

  describe('extendBuiltInValidatorFactory(Validators.minlength', () => {
    beforeEach(() => {
      validatorFn = extendBuiltInValidatorFactory(Validators.minLength(2));
    });
    it(`should return a validator function that modifies the return of the
    Validators.minlength validator function to contain a string instead of an object`, async () => {
      // The minLength validator in angular doesn't fail validation on empty strings
      const result = await validatorFn(new FormControl('x'));
      expect(typeof result.minlength === 'string').toBeTruthy();
    });

    it('should still return null if no errors where found', async () => {
      const result = await validatorFn(new FormControl(''));
      expect(result).toBeNull();
    });
  });
});
