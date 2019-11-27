import { AbstractControl, ValidationErrors } from '@angular/forms';
import { MockDefinition } from '../../models/mock-definition/mock-definition.model';
import { OpenApiSpecService } from 'src/app/services/openapispecservice/open-api-spec.service';
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
      const service = new OpenApiSpecService();
      service.readOpenApiSpec(fileReader.result as string).subscribe(
        () => resolve(null),
        errs => resolve(errs)
      );
    };
    fileReader.readAsText(file);
  });
}
