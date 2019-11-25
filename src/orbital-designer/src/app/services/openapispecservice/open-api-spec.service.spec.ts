import { TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import validOpenApiTest from '../../../test-files/valid-openapi-spec';
import { OpenApiSpecService } from './open-api-spec.service';
import { doesNotThrow } from 'assert';

describe('OpenApiSpecService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OpenApiSpecService = TestBed.get(OpenApiSpecService);
    expect(service).toBeTruthy();
  });

  it('should read a open API string and return the open api document object representation of the string', () => {
    const service: OpenApiSpecService = TestBed.get(OpenApiSpecService);
    expect(service.readOpenApiSpec(validOpenApiTest)).toBeDefined();
  });


  it('should reject an invalid opena api string', () => {
    const service: OpenApiSpecService = TestBed.get(OpenApiSpecService);
    service.readOpenApiSpec(faker.random.words()).subscribe({
      error: (err) => {
        expect(err).toEqual(['should be object']);
      }
    }
    );
  });
});
