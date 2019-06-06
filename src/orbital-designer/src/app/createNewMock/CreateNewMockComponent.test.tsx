import React from 'react';
import CreateNewMock from './CreateNewMockComponent';
import { shallow } from 'enzyme';
import NewMockTitle from './NewMockTitleComponent';
import NewMockForm from './NewMockFormComponent';

it('renders new mock title without crashing', () => {
  const app = shallow(<CreateNewMock />);
  expect(app.containsMatchingElement(<NewMockTitle />)).toBeTruthy();
});

it('renders new mock form without crashing', () => {
  const app = shallow(<CreateNewMock />);
  expect(app.containsMatchingElement(<NewMockForm />)).toBeTruthy();
});
