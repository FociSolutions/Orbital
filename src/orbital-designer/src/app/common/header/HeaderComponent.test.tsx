import React from 'react';
import { shallow } from 'enzyme';
import Header from './HeaderComponent';

it('contains "Orbital Mock" in title', () => {
  const app = shallow(<Header />);
  expect(app.find('h1').text()).toEqual('Orbital Mock');
});
