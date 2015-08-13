import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getApplicationData } from '../Actions/Actions.js';

// Vendor styles
import 'bootstrap-webpack';

// Component styles
import 'style!./Styles/Dashboard.scss';
let dashboardStyles = require('./Styles/Dashboard.scss').locals.styles;

// Components
import LeftSide from './LeftSide.js';
import RightSide from './RightSide.js';

export default class ApplicationMenu extends Component {
  render() {
    return (
      <div className={ `${ dashboardStyles }` }>
        <div className="container">
          <div className="row">
            <div className="col-md-2 col-lg-2">
              <LeftSide />
            </div>
            <div className="col-md-10 col-lg-10">
              <RightSide />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    // weeks: getWeeks(state.weeks),
    data: state.application,
  };
}

export default connect(select)(ApplicationMenu);
