import React from 'react';
import { shallow, mount } from 'enzyme';
import ImportExistingMockComponent from '../importExsitingMock/ImportExistingMockComponent';
import { Link, MemoryRouter } from 'react-router-dom';
import Home from './HomeComponent';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { ApiInformation } from '../common/models/ApiInformation';
import { Metadata } from '../common/models/mockDefinition/Metadata';
import { Endpoint } from '../common/models/mockDefinition/Endpoint';

it('renders Import Existing Mock Component correctly', () => {
  const importExistingMockComponent = shallow(<Home />);
  expect(
    importExistingMockComponent.find(<ImportExistingMockComponent />)
  ).toBeTruthy();
});

it('includes a link to CreateNewMock', () => {
  const storeConfig = configureMockStore();
  const store = storeConfig({
    apiInfo: {} as ApiInformation,
    metadata: {} as Metadata,
    endpoint: {} as Endpoint
  });
  const wrapper = mount(
    <MemoryRouter>
      <Provider store={store}>
        <Home />
      </Provider>
    </MemoryRouter>
  );
  expect(wrapper.find(Link).prop('to')).toEqual('/CreateNewMock');
});
