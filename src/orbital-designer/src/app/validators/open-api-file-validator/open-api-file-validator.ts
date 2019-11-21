import { AbstractControl, ValidationErrors } from '@angular/forms';
import { MockDefinition } from '../../models/mock-definition/mock-definition.model';
/**
 * A validator function that is used to validate the content string in the
 * Form control against the openApi spec. Only works with a single file as input
 * @param control The control to apply the validator function to
 */
export function openApiFileValidator(
  control: AbstractControl
): Promise<ValidationErrors | null> {
  const file = control.value;
  const fileReader = new FileReader();
  return new Promise(resolve => {
    fileReader.onloadend = () => {
      MockDefinition.toOpenApiSpec(fileReader.result as string).then(
        () => resolve(null),
        errs => resolve(errs)
      );
    };
    fileReader.readAsText(file);
  });
}
