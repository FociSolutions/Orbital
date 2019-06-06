import * as faker from 'faker';
import ApiInformationReducer from './ApiInformationSlice';
import { ApiInformation } from '../models/ApiInformation';

describe('Changing state', () => {
  it('has updated base on provided mock definition', () => {
    const input = {
      metadata: {},
      host: faker.internet.url(),
      basePath: '/' + faker.lorem.word(),
      endpoints: {},
      openApi: faker.lorem.paragraph()
    };

    const expected = {
      host: input.host,
      basePath: input.basePath,
      openApi: input.openApi
    } as ApiInformation;
    var actual = ApiInformationReducer({} as ApiInformation, {
      type: 'mockDefinition/import',
      payload: input
    });
    expect(actual).toEqual(expected);
  });

  it('clear ', () => {
    const input = {
      host: faker.internet.url(),
      basePath: '/' + faker.lorem.word(),
      openApi: faker.lorem.paragraph()
    };
    var state = ApiInformationReducer(input as ApiInformation, {
      type: 'mockDefinition/clear'
    });
    expect(state).toEqual({} as ApiInformation);
  });
});

describe('Updating state properties', () => {
  it('has updated the openAPI spec', () => {
    const input = faker.lorem.paragraph();
    var state = ApiInformationReducer({} as ApiInformation, {
      type: 'apiInfo/setOpenApiSpec',
      payload: input
    });
    expect(state).toEqual({ openApi: input });
  });

  it('has updated the host', () => {
    const input = faker.internet.url();
    var state = ApiInformationReducer({} as ApiInformation, {
      type: 'apiInfo/setHost',
      payload: input
    });
    expect(state).toEqual({ host: input });
  });

  it('has updated the base path', () => {
    const input = '/' + faker.lorem.word();
    var state = ApiInformationReducer({} as ApiInformation, {
      type: 'apiInfo/setBasePath',
      payload: input
    });
    expect(state).toEqual({ basePath: input });
  });
});
