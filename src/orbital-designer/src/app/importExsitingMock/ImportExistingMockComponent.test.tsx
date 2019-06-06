import React from 'react';
import { mount } from 'enzyme';
import * as faker from 'faker';
import ImportExistingMock from './ImportExistingMockComponent';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { ApiInformation } from '../common/models/ApiInformation';
import { Metadata } from '../common/models/mockDefinition/Metadata';
import { Endpoint } from '../common/models/mockDefinition/Endpoint';
import ImportExistingMockComponent from './ImportExistingMockComponent';

describe('Testing ExistingMockFile onChange handler', () => {
  it('Should successfully update title in component state for .yaml file name', () => {
    const input = new File([faker.random.words()], faker.system.fileName());
    const storeConfig = configureMockStore();
    const store = storeConfig({
      apiInfo: {} as ApiInformation,
      metadata: {} as Metadata,
      endpoint: {} as Endpoint
    });
    const wrapper = mount(
      <Provider store={store}>
        <ImportExistingMock />
      </Provider>
    );
    const existingMockComponent = wrapper.find('ImportExistingMock');
    const inputElement = wrapper.find('#mockDefinitionFile');

    inputElement.simulate('change', { target: { files: [input] } });
    expect(existingMockComponent.state('fileName')).toEqual(input.name);
  });

  it('Should expect error on showImportError()', () => {
    const storeConfig = configureMockStore();
    const store = storeConfig({
      apiInfo: {} as ApiInformation,
      metadata: {} as Metadata,
      endpoint: {} as Endpoint
    });
    const wrapper = mount(
      <Provider store={store}>
        <ImportExistingMock />
      </Provider>
    );
    var component = wrapper.find('ImportExistingMock').instance();
    component.showImportError(); //ts-lint error
    expect(wrapper.find('#mockDefinitionFile').html()).toContain('is-invalid');
  });

  it('Should hide import error on hideImportError()', () => {
    const storeConfig = configureMockStore();
    const store = storeConfig({
      apiInfo: {} as ApiInformation,
      metadata: {} as Metadata,
      endpoint: {} as Endpoint
    });
    const wrapper = mount(
      <Provider store={store}>
        <ImportExistingMock />
      </Provider>
    );
    var component = wrapper.find('ImportExistingMock').instance();
    component.showImportError(); //ts-lint error
    wrapper.update();
    component.hideImportError(); //ts-lint error
    expect(wrapper.find('#mockDefinitionFile').html()).not.toContain(
      'is-invalid'
    );
  });
});
