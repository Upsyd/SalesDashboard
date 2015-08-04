import React, { Component } from 'react';
import DashboardApp from './DashboardApp';
import { createRedux } from 'redux';
import { Provider } from 'redux/react';
import * as stores from '../Stores';

const redux = createRedux(stores);

export default class App extends Component {
  render() {
    return (
      <Provider redux={redux}>
        {() => <DashboardApp />}
      </Provider>
    );
  }
}
