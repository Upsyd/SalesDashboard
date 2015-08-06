import React from 'react';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './Containers/App';
import * as reducers from './Reducers/Reducers';

let todoApp = combineReducers(reducers);
let store = createStore(todoApp);

let rootElement = document.getElementById('Dashboard');
React.render(
  <Provider store={store}>
    {() => <App />}
  </Provider>,
  rootElement
);