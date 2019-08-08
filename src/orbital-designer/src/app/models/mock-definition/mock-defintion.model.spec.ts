import * as faker from 'faker';
import { MockDefinition } from './mock-definition.model';
import * as yaml from 'js-yaml';
import testMockDefinitionObject from '../../../test-files/test-mockdefinition-object';
import testMockDefinitionString from '../../../test-files/test-mockdefinition-file.mock';

describe('MockDefinition.toMockDefinition', () => {
  /* it('parsed mock definition string that have the correct format', async () => {
    const model = await MockDefinition.toMockDefinition(
      testMockDefinitionString
    );
    expect(model).toEqual(testMockDefinitionObject);
  }); */

  it('failed to parse due to incorrect format', async () => {
    const input = {
      metadata: faker.random.number(),
      host: faker.internet.url(),
      basePath: '/' + faker.lorem.word()
    };
    await MockDefinition.toMockDefinition(yaml.dump(input)).then(
      actual => fail(actual),
      err => expect(err).not.toBeUndefined()
    );
  });

  it('failed because content is not yaml', async () => {
    await MockDefinition.toMockDefinition('%').then(
      actual => fail(actual),
      err => expect(err).not.toBeUndefined()
    );
  });
});

describe('MockDefinition.toOpenApiSpec', () => {
  it('parsed openApi spec string that have the correct format', async () => {
    const input =
      // tslint:disable-next-line: max-line-length
      '{"swagger":"2.0","info":{"version":"1.0.0","title":"Swagger Petstore","description":"A sample API that uses a petstore as an example to demonstrate features in the swagger-2.0 specification","termsOfService":"http://swagger.io/terms/","contact":{"name":"Swagger API Team"},"license":{"name":"MIT"}},"host":"petstore.swagger.io","basePath":"/api","schemes":["http"],"consumes":["application/json"],"produces":["application/json"],"paths":{"/pets":{"get":{"description":"Returns all pets from the system that the user has access to","produces":["application/json"],"responses":{"200":{"description":"A list of pets.","schema":{"type":"array","items":{"$ref":"#/definitions/Pet"}}}}}}},"definitions":{"Pet":{"type":"object","required":["id","name"],"properties":{"id":{"type":"integer","format":"int64"},"name":{"type":"string"},"tag":{"type":"string"}}}}}';

    await MockDefinition.toOpenApiSpec(input).then(
      actual => expect(actual).toEqual(yaml.safeLoad(input)),
      err => fail(err)
    );
  });

  it('failed to parse due to incorrect format', async () => {
    const input = {
      metadata: faker.random.number(),
      host: faker.internet.url(),
      basePath: '/' + faker.lorem.word()
    };
    await MockDefinition.toOpenApiSpec(yaml.dump(input)).then(
      actual => fail(actual),
      err => expect(err).not.toBeUndefined()
    );
  });

  it('failed because content is not yaml', async () => {
    await MockDefinition.toOpenApiSpec('%').then(
      actual => fail(actual),
      err => expect(err).not.toBeUndefined()
    );
  });
});

describe('Mockdefinition.exportMockDefinitionAsYaml', () => {
  it('parsed model and returned string representing yaml content', () => {
    const result = MockDefinition.exportMockDefinitionAsYaml(
      testMockDefinitionObject
    );
    expect(result).toBe(testMockDefinitionString);
  });
});
