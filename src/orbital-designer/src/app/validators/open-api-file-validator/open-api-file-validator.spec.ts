import { openApiFileValidator } from './open-api-file-validator';
import validOpenApiString from '../../../test-files/valid-openapi-spec';
import { FormControl } from '@angular/forms';

describe('openApiFileValidator', () => {
  it('should return null if the openApi file is valid', async () => {
    const file = new File([validOpenApiString], 'test-file.yml');
    const result = await openApiFileValidator(new FormControl(file));
    expect(result).toBeNull();
  });

  it('should return an error object if the openApi file is not valid', async () => {
    const file = new File(['invalid open api'], 'test-file.yml');
    const result = await openApiFileValidator(new FormControl(file));
    expect(result).not.toBeNull();
  });
});
