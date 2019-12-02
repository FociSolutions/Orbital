import { DesignerStore } from '../../../../src/app/store/designer-store';
import { TestBed } from '@angular/core/testing';
import { MockDefinitionService } from '../../../../src/app/services/mock-definition/mock-definition.service';

describe('mockFileValidator', () => {
  let mockService: MockDefinitionService;

  beforeEach(() => {
  mockService = TestBed.get(MockDefinitionService);
  TestBed.configureTestingModule({
    imports: [
    ],
    providers: [DesignerStore, MockDefinitionService]}).compileComponents(); });

  // it('should return null if the MockDefinition file is valid', async () => {
  //   const file = new File([validMockDefinitionString], 'test-file.yml');
  //   const result = await new FormControl(file, mockFileValidator(mockService)).valid;
  //   expect(result).toBeTruthy();
  // });

  // it('should return an error object if the MockDefinition file is not valid', async () => {
  //   const file = new File(['invalid open api'], 'test-file.yml');
  //   const result = await new FormControl(file, mockFileValidator(mockService)).errors;
  //   expect(result).not.toBeNull();
  // });
});
