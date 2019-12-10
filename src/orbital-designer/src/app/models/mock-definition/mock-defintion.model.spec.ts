import * as faker from 'faker';
import { MockDefinition } from './mock-definition.model';
import validMockDefinition from '../../../test-files/test-mockdefinition-object';
import testMockDefinitionString from '../../../test-files/test-mockdefinition-file.mock';
import { Scenario } from './scenario/scenario.model';
import { RequestMatchRule } from './scenario/request-match-rule.model';

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
    await MockDefinition.toMockDefinitionAsync(JSON.stringify(input)).then(
      actual => fail(actual),
      err => expect(err).not.toBeUndefined()
    );
  });

  it('failed because content is not yaml', async () => {
    await MockDefinition.toMockDefinitionAsync('%').then(
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
      actual => expect(actual).toEqual(JSON.parse(input)),
      err => fail(err)
    );
  });

  it('failed to parse due to incorrect format', async () => {
    const input = {
      metadata: faker.random.number(),
      host: faker.internet.url(),
      basePath: '/' + faker.lorem.word()
    };
    await MockDefinition.toOpenApiSpec(JSON.stringify(input)).then(
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

describe('Mockdefinition.exportMockDefinition', () => {
  it('parsed model and returned string representing json content', () => {
    const input = validMockDefinition;
    const actual = MockDefinition.exportMockDefinition(input);
    expect(actual).toEqual(JSON.stringify(input));
  });

  it('parsed model with null request match rules and returned string representing json content', () => {
    const input = {scenarios: [{requestMatchRules: null} as Scenario]} as MockDefinition;
    const actual = MockDefinition.exportMockDefinition(input);
    expect(actual).toEqual(JSON.stringify(input));
  });

  it('parsed model with a not null request match rules and returned string representing json content', () => {
    const input = {scenarios: [{requestMatchRules: {} as RequestMatchRule} as Scenario]} as MockDefinition;
    const actual = MockDefinition.exportMockDefinition(input);
    expect(actual).toEqual(JSON.stringify(input));
  });

  it('parsed model with a null scenario and returned string representing json content', () => {
    const input = {scenarios: null} as MockDefinition;
    const actual = MockDefinition.exportMockDefinition(input);
    expect(actual).toEqual(JSON.stringify(input));
  });

  it('parsed model with a not null scenario and returned string representing json content', () => {
    const input = {scenarios: [{}] as Scenario[]} as MockDefinition;
    const actual = MockDefinition.exportMockDefinition(input);
    expect(actual).toEqual(JSON.stringify(input));
  });

  it('failed to parsed model because it contains duplicate scenario ids', async () => {
    const testMockDefinitionObject = await MockDefinition.toMockDefinitionAsync(
      testMockDefinitionString
    );
    const invalidMockDefinitionObject = JSON.parse(JSON.stringify(testMockDefinitionObject)) as MockDefinition;
    // this check leaves the other fields undefined so that future validation overlap does not occur
    const testScenario = {} as Scenario;
    invalidMockDefinitionObject.scenarios.push(testScenario);
    invalidMockDefinitionObject.scenarios[0].id = invalidMockDefinitionObject.scenarios[1].id;
    const result = MockDefinition.exportMockDefinition(
      testMockDefinitionObject as MockDefinition
    );

    await MockDefinition.toOpenApiSpec(result).then(
      actual => fail(actual),
      err => expect(err).not.toBeUndefined()
    );
  });

  it('failed to parsed model because it contains a response body which is invalid json', async () => {
    const testMockDefinitionObject = await MockDefinition.toMockDefinitionAsync(
      testMockDefinitionString
    );
    const invalidMockDefinitionObject = JSON.parse(JSON.stringify(testMockDefinitionObject)) as MockDefinition;
    // this check leaves the other fields undefined so that future validation overlap does not occur
    const testScenario = {} as Scenario;
    invalidMockDefinitionObject.scenarios.push(testScenario);
    invalidMockDefinitionObject.scenarios[0].response.body = '<xml>invalid</xml>';
    const result = MockDefinition.exportMockDefinition(
      testMockDefinitionObject as MockDefinition
    );

    await MockDefinition.toOpenApiSpec(result).then(
      actual => fail(actual),
      err => expect(err).not.toBeUndefined()
    );
  });
});
