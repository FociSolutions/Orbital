import * as faker from 'faker';
import MetadataReducer from './MetadataSlice';
import { Metadata } from '../models/mockDefinition/Metadata';

describe('Changing state', () => {
  it('has updated base on provided mock definition', () => {
    const input = {
      metadata: {
        title: faker.lorem.word(),
        description: faker.lorem.paragraph()
      },
      host: faker.internet.url(),
      basePath: '/' + faker.lorem.word(),
      endpoints: {},
      openApi: faker.lorem.paragraph()
    };

    var actual = MetadataReducer({} as Metadata, {
      type: 'mockDefinition/import',
      payload: input
    });
    expect(actual).toEqual(input.metadata);
  });

  it('clear ', () => {
    const input = {
      title: faker.lorem.word(),
      description: faker.lorem.paragraph()
    };
    var state = MetadataReducer(input as Metadata, {
      type: 'mockDefinition/clear'
    });
    expect(state).toEqual({} as Metadata);
  });
});

describe('Updating state properties', () => {
  it('has updated the metadata', () => {
    const input = {
      title: faker.lorem.text(),
      description: faker.lorem.sentence()
    };
    var state = MetadataReducer({} as Metadata, {
      type: 'metadata/setMetadata',
      payload: input
    });
    expect(state).toEqual(input);
  });
});
