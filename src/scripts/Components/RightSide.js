import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';

// Vendor styles
import 'bootstrap-webpack';

// Component styles
import 'style!./Styles/RightSide.scss';
let styles = require('./Styles/RightSide.scss').locals.styles;
import 'style!./Widgets/Widget.scss';
let stylesWidget = require('./Widgets/Widget.scss').locals.styles;

// Components
import Proposals from './Widgets/Proposals/Proposals.component.js';
import Deliveries from './Widgets/Deliveries/Deliveries.component.js';
import Orders from './Widgets/Orders/Orders.component.js';
import Gross from './Widgets/Gross/Gross.component.js';
import Backlog from './Widgets/Backlog/Backlog.component.js';
import OrdersTable from './Widgets/OrdersTable/OrdersTable.component.js';
import Performance from './Widgets/Performance/Performance.component.js';
import AdditionalServices from './Widgets/AdditionalServices/AdditionalServices.component.js';

export default class RightSide extends Component {
  render() {
    const { week, year } = this.props;
    return (
      <div className={ `${ styles }` }>
        <div className='row'>
          <h3 className='header'>
            { week } Week, { year } Year
          </h3>
          <div className='col-md-6 col-lg-6'>
            <OrdersTable className={ stylesWidget } />
            <AdditionalServices className={ stylesWidget } />
          </div>
          <div className='col-md-6 col-lg-6'>
            <Performance className={ stylesWidget } />
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  // function getWeeks(data) {
  //   let weeks = [];

  //   data.items.map((shop) => {
  //     weeks.push(shop.Week);
  //   });

  //   return _.uniq(weeks);
  // }

  return {
    // weeks: getWeeks(state.weeks),
    week: state.weeks.week,
    year: state.weeks.year
  };
}

export default connect(select)(RightSide);
