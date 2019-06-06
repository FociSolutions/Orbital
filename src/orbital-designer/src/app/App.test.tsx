import React from 'react';
import { shallow, mount } from 'enzyme';
import App from './App';
import Header from './common/header/HeaderComponent';
import { MemoryRouter } from 'react-router-dom';
import CreateNewMock from './createNewMock/CreateNewMockComponent';
import ScenarioMock from './scenarios/ScenarioMockComponent';
import EndpointScenarioOverview from './endpointScenarioOverview/EndpointScenarioOverviewComponent';
import Home from './home/HomeComponent';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { ApiInformation } from './common/models/ApiInformation';
import { Metadata } from './common/models/mockDefinition/Metadata';
import { Endpoint } from './common/models/mockDefinition/Endpoint';

it('renders header component', () => {
  const app = shallow(<App />);
  expect(app.containsMatchingElement(<Header />)).toBeTruthy();
});

describe('EndpointScenarioOverview routing test', () => {
  it('should route to /EndpointScenarioOverview', () => {
    const storeConfig = configureMockStore();
    const store = storeConfig({
      apiInfo: {} as ApiInformation,
      metadata: {} as Metadata,
      endpoint: {} as Endpoint
    });
    const wrapper = mount(
      <MemoryRouter
        initialIndex={0}
        initialEntries={['/EndpointScenarioOverview']}
      >
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>
    );
    expect(wrapper.find(EndpointScenarioOverview)).toHaveLength(1);
    wrapper.unmount();
  });
});

describe('createNewMock routing test', () => {
  it('should show createNewMock component for router', () => {
    const storeConfig = configureMockStore();
    const store = storeConfig({
      apiInfo: {} as ApiInformation,
      metadata: {} as Metadata,
      endpoint: {} as Endpoint
    });
    const wrapper = mount(
      <MemoryRouter initialIndex={0} initialEntries={['/CreateNewMock']}>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>
    );
    expect(wrapper.find(CreateNewMock)).toHaveLength(1);
    wrapper.unmount();
  });
});

describe('create Scenarios routing test', () => {
  it('should show ScenariosMock component for router', () => {
    const storeConfig = configureMockStore();
    const store = storeConfig({
      apiInfo: {} as ApiInformation,
      metadata: {} as Metadata,
      endpoint: {} as Endpoint
    });
    const wrapper = mount(
      <MemoryRouter initialIndex={0} initialEntries={['/Scenarios']}>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>
    );
    expect(wrapper.find(ScenarioMock)).toHaveLength(1);
    wrapper.unmount();
  });
});

describe('Root test', () => {
  it('Should successfully route to home component', () => {
    const storeConfig = configureMockStore();
    const store = storeConfig({
      apiInfo: {} as ApiInformation,
      metadata: {} as Metadata,
      endpoint: {} as Endpoint
    });
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>
    );
    expect(wrapper.find(Home)).toHaveLength(1);
    wrapper.unmount();
  });
});
