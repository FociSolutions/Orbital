import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function extendBuiltInValidatorFactory(fn: ValidatorFn): ValidatorFn {
  const errorMessageMap = {
    required: () => 'Input is required',
    maxlength: ({ requiredLength }) =>
      `Max character length of ${requiredLength}exceeded`,
    minlength: ({ requiredLength }) =>
      `Required min length of ${requiredLength}`
  };
  return (control: AbstractControl): ValidationErrors | null => {
    const errors = fn(control);
    if (!!errors) {
      for (const key of Object.keys(errors)) {
        errors[key] = errorMessageMap[key](errors[key]);
      }
      return errors;
    }
  };
}
