import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './app/App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import logger from 'redux-logger';
import ApiInformationReducer from './app/common/ducks/ApiInformationSlice';
import MetadataReducer from './app/common/ducks/MetadataSlice';
import EndpointReducer from './app/common/ducks/EndpointSlice';
import { BrowserRouter } from 'react-router-dom';

var reducer = {
    apiInfo: ApiInformationReducer,
    metadata: MetadataReducer,
    endpoint: EndpointReducer
};

var middleware = [...getDefaultMiddleware(), logger];

var store = configureStore({
    reducer,
    middleware,
    devTools: process.env.NODE_ENV !== 'production'
});

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
