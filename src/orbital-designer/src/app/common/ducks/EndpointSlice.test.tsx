import * as faker from 'faker';
import { Endpoint } from '../models/mockDefinition/Endpoint';
import EndpointReducer from './EndpointSlice';

describe('Changing state', () => {
  it('has updated base on provided mock definition', () => {
    const input = {
      metadata: {},
      host: faker.internet.url(),
      basePath: '/' + faker.lorem.word(),
      endpoints: {
        verb: faker.lorem.word(),
        path: faker.lorem.word(),
        requestMatching: {}
      },
      openApi: faker.lorem.paragraph()
    };

    var actual = EndpointReducer({} as Endpoint, {
      type: 'mockDefinition/import',
      payload: input
    });
    expect(actual).toEqual(input.endpoints);
  });

  it('clear ', () => {
    const input = {
      verb: faker.lorem.word(),
      path: faker.lorem.word(),
      requestMatching: {}
    };
    var state = EndpointReducer(input as Endpoint, {
      type: 'mockDefinition/clear'
    });
    expect(state).toEqual({} as Endpoint);
  });
});
