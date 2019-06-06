import { mapStateToProps, mapDispatchToProps } from './Container';
import { Props } from '../ImportExistingMockComponent';
import * as faker from 'faker';
import { MockDefinition } from '../../common/models/mockDefinition/MockDefinition';

describe('mapStateToProps', () => {
  it('mapped mock definition in state to prop', () => {
    const input = {
      apiInfo: {
        host: faker.internet.url(),
        basePath: '/' + faker.lorem.word(),
        openApi: faker.lorem.paragraph()
      },
      metadata: {
        title: faker.lorem.text(),
        description: faker.lorem.sentence()
      },
      endpoint: {
        verb: faker.lorem.word(),
        path: faker.lorem.word(),
        requestMatching: {}
      }
    };
    var actual = mapStateToProps(input, {} as Props);

    expect(actual.mockDefinition.basePath).toEqual(input.apiInfo.basePath);
    expect(actual.mockDefinition.endpoints).toEqual(input.endpoint);
    expect(actual.mockDefinition.host).toEqual(input.apiInfo.host);
    expect(actual.mockDefinition.metadata).toEqual(input.metadata);
    expect(actual.mockDefinition.openApi).toEqual(input.apiInfo.openApi);
  });
});

describe('mapDispatchToProps', () => {
  it('has executed correct action for onImport', () => {
    const dispatch = jest.fn();
    const input = {
      metadata: {},
      host: faker.internet.url(),
      basePath: '/' + faker.lorem.word(),
      endpoints: {},
      openApi: faker.lorem.paragraph()
    };
    mapDispatchToProps(dispatch).onImport(input as MockDefinition);
    expect(dispatch.mock.calls[0][0]).toEqual({
      payload: input,
      type: 'mockDefinition/import'
    });
  });
});
