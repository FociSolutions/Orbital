import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { MockDefinitionService } from 'src/app/services/mock-definition/mock-definition.service';

/**
 * A validator function that is used to validate the content string in the
 * Form control against the mock def spec. Only works with a single file as input
 * @param control The control to apply the validator function to
 */
export function mockFileValidator(
  mockdefservice: MockDefinitionService
): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> => {
    const file = control.value;
    return new Promise(resolve => {
      mockdefservice.deserialize(file).subscribe(
        () => resolve(null),
        errs => resolve(errs)
      );
  }); };
}
