import { ValidationErrors, AbstractControl } from '@angular/forms';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { NGXLogger } from 'ngx-logger';

/**
 * Returns a validator function used to validate whether or not an object is a MockDefinition
 * @param logger The NGXLogger to use
 */
export function mockDefinitionObjectValidatorFactory(logger: NGXLogger) {
  return async function mockDefinitionObjectValidator(
    control: AbstractControl
  ): Promise<ValidationErrors | null> {
    if (!MockDefinition.isMockDefinition(control.value)) {
      logger.debug('Invalid Mock Definition', control.value);
      return {
        validationError: `${control.value} is not a valid mock definition`
      };
    }
    logger.debug('Valid Mock Definition');
    return null;
  };
}
