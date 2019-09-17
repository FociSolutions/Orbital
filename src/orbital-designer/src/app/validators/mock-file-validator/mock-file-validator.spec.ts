import { mockFileValidator } from './mock-file-validator';
import validMockDefinitionString from '../../../test-files/test-mockdefinition-file.mock';
import { FormControl } from '@angular/forms';

describe('mockFileValidator', () => {
  it('should return null if the MockDefinition file is valid', async () => {
    const file = new File([validMockDefinitionString], 'test-file.yml');
    const result = await mockFileValidator(new FormControl(file));
    expect(result).toBeNull();
  });

  it('should return an error object if the MockDefinition file is not valid', async () => {
    const file = new File(['invalid open api'], 'test-file.yml');
    const result = await mockFileValidator(new FormControl(file));
    expect(result).not.toBeNull();
  });
});
