import { mockDefinitionObjectValidatorFactory } from './mock-definition-object-validator';
import { NGXLoggerMock } from 'ngx-logger/testing';
import { NGXLogger } from 'ngx-logger';
import { FormControl } from '@angular/forms';
import validMockDefinition from '../../../test-files/test-mockdefinition-object';

describe('mockDefinitionValidator', () => {
  let logger: NGXLoggerMock;

  beforeEach(() => {
    logger = new NGXLoggerMock();
  });

  it('Should return a result of ValidationErrors if the mock definition object is invalid', async () => {
    const mockObject = new Object();
    const validatorFn = mockDefinitionObjectValidatorFactory(
      logger as NGXLogger
    );
    const result = await validatorFn(new FormControl(mockObject));
    expect(result).not.toBeNull();
    // Ensuring that the object isn't empty
    expect(Object.keys(result).length).toBeGreaterThan(0);
  });

  it('Should return null if the mock definition object is valid', async () => {
    const validatorFn = mockDefinitionObjectValidatorFactory(
      logger as NGXLogger
    );
    const result = await validatorFn(new FormControl(validMockDefinition));
    expect(result).toBeNull();
  });
});
