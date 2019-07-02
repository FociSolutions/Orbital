import { TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import validTests from './openApi-test-files/valid-test-cases';
import invalidTests from './openApi-test-files/invalid-test-cases';
import { FileParserService } from './file-parser.service';

describe('FileParserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileParserService = TestBed.get(FileParserService);
    expect(service).toBeTruthy();
  });

  it('should read a file and return the content string', async (done) => {
    const service: FileParserService = TestBed.get(FileParserService);
    for (const contentString of validTests) {
      const file = new File([contentString], 'test.yml');
      await expectAsync(service.read(file)).toBeResolvedTo(contentString);
    }
    done();
  });

  it('should read a valid Open Api Spec file and create an OpenApi.Doc representation', async (done) => {
    const service: FileParserService = TestBed.get(FileParserService);
    for (const contentString of validTests) {
      const file = new File([contentString], 'test.yml');
      await expectAsync(service.readOpenApiSpec(file)).toBeResolved();
    }
    done();
  });

  it('should reject an invalid Open Api Spec file', async (done) => {
    const service: FileParserService = TestBed.get(FileParserService);
    for (const contentString of invalidTests) {
      const file = new File([contentString], 'test.yml');
      await expectAsync(service.readOpenApiSpec(file)).toBeRejected();
    }
    done();
  });
});
