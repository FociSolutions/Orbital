import React from 'react';
import ReactDOM from 'react-dom';
import CreateNewMock from './CreateNewMockComponent';
import { BrowserRouter } from 'react-router-dom';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<BrowserRouter><CreateNewMock /></BrowserRouter>, div);
     ReactDOM.unmountComponentAtNode(div);
  });
  