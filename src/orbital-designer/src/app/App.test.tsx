import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import App from './App';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const initialState= {};
it('renders without crashing', () => {
  const div = document.createElement('div');
  let store = mockStore({initialState}); 
  const wrapper = shallow(<Provider store={store}><App /></Provider>);
  const connectedComponentWrapper = wrapper.dive().dive();
  connectedComponentWrapper.setProps({importmockfile: {mockfiles: [{file:'', filename: ''}]}});
  ReactDOM.render(<Provider store={store}>connectedComponentWrapper.getElement()</Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});
