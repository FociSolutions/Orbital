import * as faker from 'faker';
import yaml from 'js-yaml';
import read, {
  readMockDefinition,
  readOpenApiSpec
} from './FileProcessService';

describe('read', () => {
  it('able to read from file', async () => {
    var expected = faker.random.words();
    var input = new File([expected], faker.system.fileName());

    await read(input).then(
      actual => expect(actual).toEqual(expected),
      err => fail(err)
    );
  });
});

describe('readMockDefinition', () => {
  it('able to read and parse to mock definition', async () => {
    var expected = {
      metadata: {},
      host: faker.internet.url(),
      basePath: '/' + faker.lorem.word(),
      endpoints: {},
      openApi: faker.lorem.paragraph()
    };
    var input = new File([yaml.dump(expected)], faker.system.fileName());

    await readMockDefinition(input).then(
      actual => expect(actual).toEqual(expected),
      err => fail(err)
    );
  });

  it('failed to read and parse invalid mock definition file', async () => {
    var input = new File(
      [
        yaml.dump({
          metadata: faker.random.number(),
          host: faker.internet.url(),
          basePath: '/' + faker.lorem.word()
        })
      ],
      faker.system.fileName()
    );

    await readMockDefinition(input).then(
      actual => fail(actual),
      err => expect(err).not.toBeUndefined()
    );
  });
});

describe('readOpenApiSpec', () => {
  it('able to read and parse to openAPI spec', async () => {
    var expected =
      '{"swagger":"2.0","info":{"version":"1.0.0","title":"Swagger Petstore","description":"A sample API that uses a petstore as an example to demonstrate features in the swagger-2.0 specification","termsOfService":"http://swagger.io/terms/","contact":{"name":"Swagger API Team"},"license":{"name":"MIT"}},"host":"petstore.swagger.io","basePath":"/api","schemes":["http"],"consumes":["application/json"],"produces":["application/json"],"paths":{"/pets":{"get":{"description":"Returns all pets from the system that the user has access to","produces":["application/json"],"responses":{"200":{"description":"A list of pets.","schema":{"type":"array","items":{"$ref":"#/definitions/Pet"}}}}}}},"definitions":{"Pet":{"type":"object","required":["id","name"],"properties":{"id":{"type":"integer","format":"int64"},"name":{"type":"string"},"tag":{"type":"string"}}}}}';
    var input = new File([expected], faker.system.fileName());

    await readOpenApiSpec(input).then(
      actual => expect(actual).toEqual(yaml.safeLoad(expected)),
      err => fail(err)
    );
  });

  it('failed to read and parse invalid openAPI spec file', async () => {
    var input = new File(
      [
        yaml.dump({
          metadata: faker.random.number(),
          host: faker.internet.url(),
          basePath: '/' + faker.lorem.word()
        })
      ],
      faker.system.fileName()
    );

    await readOpenApiSpec(input).then(
      actual => fail(actual),
      err => expect(err).not.toBeUndefined()
    );
  });
});
