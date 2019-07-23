import { TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import validOpenApiTest from '../../test-files/valid-openapi-spec';
import { FileParserService } from './file-parser.service';

describe('FileParserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileParserService = TestBed.get(FileParserService);
    expect(service).toBeTruthy();
  });

  it('should read a file and return the content string', async done => {
    const service: FileParserService = TestBed.get(FileParserService);
    const file = new File([validOpenApiTest], 'test.yml');
    await expectAsync(service.read(file)).toBeResolvedTo(validOpenApiTest);
    done();
  });

  it('should read a valid Open Api Spec file and create an OpenApi.Doc representation', async done => {
    const service: FileParserService = TestBed.get(FileParserService);
    const file = new File([validOpenApiTest], 'test.yml');
    await expectAsync(service.readOpenApiSpec(file)).toBeResolved();
    done();
  });

  it('should reject an invalid Open Api Spec file', async done => {
    const service: FileParserService = TestBed.get(FileParserService);
    const file = new File([faker.random.words()], 'test.yml');
    await expectAsync(service.readOpenApiSpec(file)).toBeRejected();
    done();
  });
});
