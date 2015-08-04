import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Connector } from 'redux/react';
import { connect } from 'redux/react';

import Dashboard from '../components/Dashboard';
import * as Actions from '../Actions/Actions';

export default class DashboardApp extends Component {
  render() {
    const { counter, dispatch } = this.props;
    return (
      <Connector select={state => ({ store: state.store })}>
        {this.renderChild}
      </Connector>
    );
  }
  renderChild({ store, dispatch }) {
    const actions = bindActionCreators(Actions, dispatch);
    return (
        <Dashboard store={store} actions={actions} />
    );
  }
}
