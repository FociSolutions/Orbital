import { AbstractControl, ValidationErrors } from '@angular/forms';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';

/**
 * A validator function that is used to validate the content string in the
 * Form control against the openApi spec
 * @param control The control to apply the validator function to
 */
export function openApiFileValidator(
  control: AbstractControl
): Promise<ValidationErrors | null> {
  return new Promise((resolve, reject) => {
    MockDefinition.toOpenApiSpec(control.value).then(
      doc => resolve(null),
      errs => resolve(errs)
    );
  });
}
