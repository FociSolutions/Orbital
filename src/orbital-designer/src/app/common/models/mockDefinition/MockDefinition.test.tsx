import * as faker from 'faker';
import {
  isMockDefinition,
  toMockDefinition,
  toOpenApiSpec
} from './MockDefinition';
import yaml from 'js-yaml';

describe('toMockDefinition', () => {
  it('parsed mock definition string that have the correct format', async () => {
    const input = {
      metadata: {},
      host: faker.internet.url(),
      basePath: '/' + faker.lorem.word(),
      endpoints: {},
      openApi: faker.lorem.paragraph()
    };

    await toMockDefinition(yaml.dump(input)).then(
      actual => expect(actual).toEqual(input),
      err => fail(err)
    );
  });

  it('failed to parse due to incorrect format', async () => {
    const input = {
      metadata: faker.random.number(),
      host: faker.internet.url(),
      basePath: '/' + faker.lorem.word()
    };
    await toMockDefinition(yaml.dump(input)).then(
      actual => fail(actual),
      err => expect(err).not.toBeUndefined()
    );
  });

  it('failed because content is not yaml', async () => {
    await toMockDefinition('%').then(
      actual => fail(actual),
      err => expect(err).not.toBeUndefined()
    );
  });
});

describe('toOpenApiSpec', () => {
  it('parsed openApi spec string that have the correct format', async () => {
    const input =
      '{"swagger":"2.0","info":{"version":"1.0.0","title":"Swagger Petstore","description":"A sample API that uses a petstore as an example to demonstrate features in the swagger-2.0 specification","termsOfService":"http://swagger.io/terms/","contact":{"name":"Swagger API Team"},"license":{"name":"MIT"}},"host":"petstore.swagger.io","basePath":"/api","schemes":["http"],"consumes":["application/json"],"produces":["application/json"],"paths":{"/pets":{"get":{"description":"Returns all pets from the system that the user has access to","produces":["application/json"],"responses":{"200":{"description":"A list of pets.","schema":{"type":"array","items":{"$ref":"#/definitions/Pet"}}}}}}},"definitions":{"Pet":{"type":"object","required":["id","name"],"properties":{"id":{"type":"integer","format":"int64"},"name":{"type":"string"},"tag":{"type":"string"}}}}}';

    await toOpenApiSpec(input).then(
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
    await toOpenApiSpec(yaml.dump(input)).then(
      actual => fail(actual),
      err => expect(err).not.toBeUndefined()
    );
  });

  it('failed because content is not yaml', async () => {
    await toOpenApiSpec('%').then(
      actual => fail(actual),
      err => expect(err).not.toBeUndefined()
    );
  });
});

describe('isMockDefinition', () => {
  it('validate mock definition with correct format', () => {
    const input = {
      metadata: {},
      host: faker.internet.url(),
      basePath: '/' + faker.lorem.word(),
      endpoints: {},
      openApi: faker.lorem.paragraph()
    };
    var actual = isMockDefinition(input);
    expect(actual).toBeTruthy();
  });

  it('validate mock definition with incorrect format', () => {
    const input = {
      metadata: faker.random.number(),
      host: faker.internet.url(),
      basePath: '/' + faker.lorem.word()
    };
    var actual = isMockDefinition(input);
    expect(actual).toBeFalsy();
  });
});
