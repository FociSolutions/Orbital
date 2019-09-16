import { AbstractControl, ValidationErrors } from '@angular/forms';
import { MockDefinition } from '../../models/mock-definition/mock-definition.model';

export async function mockObjectValidator(
  control: AbstractControl
): Promise<ValidationErrors | null> {
  const objectArr = control.value;
  for (const obj of objectArr) {
    if (!MockDefinition.isMockDefinition(obj)) {
      return {
        error: 'Response did not contain a list of valid MockDefinitions'
      };
    }
  }
}
