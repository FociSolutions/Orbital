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
});
