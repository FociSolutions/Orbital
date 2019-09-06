import {
  AbstractControl,
  ValidationErrors,
  FormControl,
  FormGroupDirective,
  NgForm
} from '@angular/forms';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { ErrorStateMatcher } from '@angular/material/core';

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
