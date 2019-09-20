import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';

/**
 * A factory that takes a validator function as a parameter and returns a new validator function
 * that performs the same as the validator function passed to it expect it replaces the resulting error
 * with a more descriptive message if available. If no such method is available it doesn't modify the original
 * error message.
 * This was made to work with angular's built in validators ( see https://angular.io/api/forms/Validators) in
 * order to give the validators more meaningful messages without having to repeat code in multiple components.
 * This is required because the ValidationErrors returned from these validators are usually objects with no
 * meaningful messages to let a user know why the validation failed (ex: when the required validator fails
 * a control it returns {required: true})
 * @param fn The validator function to extend
 * @param logger The NGXLogger to use
 */
export function extendBuiltInValidatorFactory(
  fn: ValidatorFn,
  logger: NGXLogger
): ValidatorFn {
  const errorMessageMap = {
    required: () => 'Input is required',
    maxlength: ({ requiredLength }) =>
      `Max character length of ${requiredLength} exceeded`,
    minlength: ({ requiredLength }) =>
      `Required min length of ${requiredLength}`
  };
  return (control: AbstractControl): ValidationErrors | null => {
    const errors = fn(control);
    if (!!errors) {
      for (const key of Object.keys(errors)) {
        const errMessage = errorMessageMap[key](errors[key]);
        errors[key] = !!errMessage ? errMessage : errors[key];
      }
      logger.debug('Validation errors', errors);
      return errors;
    }
    return null;
  };
}
