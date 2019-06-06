import React from 'react';
import * as faker from 'faker';
import { mount } from 'enzyme';
import NewMockForm from './NewMockFormComponent';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { ApiInformation } from '../common/models/ApiInformation';
import { Metadata } from '../common/models/mockDefinition/Metadata';
import { Endpoint } from '../common/models/mockDefinition/Endpoint';

describe('Testing NewMockForm onChange handler', () => {
  it('Should capture Mock Name correctly onChange', () => {
    const input = faker.random.words();
    const storeConfig = configureMockStore();
    const store = storeConfig({
      apiInfo: {} as ApiInformation,
      metadata: {} as Metadata,
      endpoint: {} as Endpoint
    });
    const componentWrapper = mount(
      <BrowserRouter>
        <Provider store={store}>
          <NewMockForm />
        </Provider>
      </BrowserRouter>
    );
    const newMockFormComponent = componentWrapper.find('NewMockForm');
    const inputElement = componentWrapper.find('#validationMockName');

    inputElement.simulate('change', { target: { value: input } });
    expect(newMockFormComponent.state('currentMockName')).toEqual(input);
  });

  it('Should capture Mock Description correctly onChange', () => {
    const input = faker.lorem.paragraph();
    const storeConfig = configureMockStore();
    const store = storeConfig({
      apiInfo: {} as ApiInformation,
      metadata: {} as Metadata,
      endpoint: {} as Endpoint
    });
    const componentWrapper = mount(
      <BrowserRouter>
        <Provider store={store}>
          <NewMockForm />
        </Provider>
      </BrowserRouter>
    );
    const newMockFormComponent = componentWrapper.find('NewMockForm');
    const inputElement = componentWrapper.find('#mockDescription');

    inputElement.simulate('change', { target: { value: input } });
    expect(newMockFormComponent.state('currentDescription')).toEqual(input);
  });

    it('Should set filename with onFileChange in OpenAPI Spec input', () => {
        const input = new File([faker.random.words()], faker.system.fileName());
        const storeConfig = configureMockStore();
        const store = storeConfig({
          apiInfo: {} as ApiInformation,
          metadata: {} as Metadata,
          endpoint: {} as Endpoint
        });
        const wrapper = mount(
        <BrowserRouter>
          <Provider store={store}>
            <NewMockForm />
          </Provider>
        </BrowserRouter>
        );
        const existingMockComponent = wrapper.find('NewMockForm');
        const inputElement = wrapper.find('#openAPISpec');
    
        inputElement.simulate('change', { target: { files: [input] } });
        expect(existingMockComponent.state('fileName')).toEqual(input.name);
    })

    it('Should fail using invalid file with onFileChange in OpenAPI Spec input', () => {
        const storeConfig = configureMockStore();
        const store = storeConfig({
          apiInfo: {} as ApiInformation,
          metadata: {} as Metadata,
          endpoint: {} as Endpoint
        });
        const wrapper = mount(
        <BrowserRouter>
          <Provider store={store}>
            <NewMockForm />
          </Provider>
        </BrowserRouter>
        );
        const existingMockComponent = wrapper.find('NewMockForm');
        const inputElement = wrapper.find('#openAPISpec');
    
        inputElement.simulate('change', { target: { files: [] } });
        expect(existingMockComponent.state('fileName')).toEqual('Choose file');
    })
} );

describe('OpenAPI spec file read', () => {
  it('Should show file error when called showFileError', () => {
    const storeConfig = configureMockStore();
    const store = storeConfig({
      apiInfo: {} as ApiInformation,
      metadata: {} as Metadata,
      endpoint: {} as Endpoint
    });
    const wrapper = mount(
      <MemoryRouter>
        <Provider store={store}>
          <NewMockForm />
        </Provider>
      </MemoryRouter>
    );
    var component = wrapper.find('NewMockForm').instance();
    component.showFileError(); // tslint:disable-line
    expect(wrapper.find('#openAPISpec').html()).toContain('is-invalid');
  });

  it('Should hide file error when called hideFileError', () => {
    const storeConfig = configureMockStore();
    const store = storeConfig({
      apiInfo: {} as ApiInformation,
      metadata: {} as Metadata,
      endpoint: {} as Endpoint
    });
    const wrapper = mount(
      <MemoryRouter>
        <Provider store={store}>
          <NewMockForm />
        </Provider>
      </MemoryRouter>
    );
    var component = wrapper.find('NewMockForm').instance();
    component.showFileError(); // tslint:disable-line
    wrapper.update();
    component.hideFileError(); // tslint:disable-line
    expect(wrapper.find('#openAPISpec').html()).not.toContain('is-invalid');
  });

  it('Should update open api info and hide file error', () => {
    const storeConfig = configureMockStore();
    const store = storeConfig({
      apiInfo: {} as ApiInformation,
      metadata: {} as Metadata,
      endpoint: {} as Endpoint
    });
    const wrapper = mount(
      <MemoryRouter>
        <Provider store={store}>
          <NewMockForm />
        </Provider>
      </MemoryRouter>
    );
    var input = {
      openApi: faker.random.words(),
      host: faker.internet.url(),
      basePath: '/' + faker.random.word()
    };
    var instance = wrapper.find('NewMockForm').instance();
    instance.setOpenApiInfo(input.openApi, input.host, input.basePath); // tslint:disable-line

    var component = wrapper.find('NewMockForm');
    expect(component.state('openApiSpec')).toEqual(input.openApi);
    expect(component.state('host')).toEqual(input.host);
    expect(component.state('basePath')).toEqual(input.basePath);
    expect(wrapper.find('#openAPISpec').html()).not.toContain('is-invalid');
  });
});
