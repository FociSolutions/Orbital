import { AbstractControl, ValidationErrors } from '@angular/forms';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';

export function openApiFileValidator(
  control: AbstractControl
): Promise<ValidationErrors | null> {
  return new Promise((resolve, reject) => {
    MockDefinition.toOpenApiSpec(control.value).then(
      doc => resolve(doc),
      errs => reject(errs)
    );
  });
}
