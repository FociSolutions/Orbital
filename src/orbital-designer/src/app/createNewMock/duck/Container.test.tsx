import * as faker from 'faker';
import { mapStateToProps, mapDispatchToProps } from './Container';
import { Props } from '../NewMockFormComponent';

describe('mapStateToProps', () => {
  it('passed props as is', () => {
    const input = {};
    var actual = mapStateToProps(input as Props);
    expect(actual).toEqual(input);
  });
});

describe('mapDispatchToProps', () => {
  it('has executed correct action for onMetadata', () => {
    const dispatch = jest.fn();
    const input = {
      title: faker.lorem.words(),
      description: faker.lorem.sentence()
    };
    mapDispatchToProps(dispatch).onMetadata(input);
    expect(dispatch.mock.calls[0][0]).toEqual({
      payload: input,
      type: 'metadata/setMetadata'
    });
  });

  it('has executed correct action for onOpenApi', () => {
    const dispatch = jest.fn();
    const input = faker.random.words();
    mapDispatchToProps(dispatch).onOpenApi(input);
    expect(dispatch.mock.calls[0][0]).toEqual({
      payload: input,
      type: 'apiInfo/setOpenApiSpec'
    });
  });

  it('has executed correct action for onHost', () => {
    const dispatch = jest.fn();
    const input = faker.internet.url();
    mapDispatchToProps(dispatch).onHost(input);
    expect(dispatch.mock.calls[0][0]).toEqual({
      payload: input,
      type: 'apiInfo/setHost'
    });
  });

  it('has executed correct action for onBasePath', () => {
    const dispatch = jest.fn();
    const input = '/' + faker.random.word();
    mapDispatchToProps(dispatch).onBasePath(input);
    expect(dispatch.mock.calls[0][0]).toEqual({
      payload: input,
      type: 'apiInfo/setBasePath'
    });
  });
});
