import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';

import { weekIncrease, weekDecrease } from '../Actions/Actions.js';

// Component styles
import 'style!./Styles/Weeks.scss';
let styles = require('./Styles/Weeks.scss').locals.styles;

class Weeks extends Component {

  increase() {
    const { week, weeks, dispatch } = this.props;
    let max = weeks[weeks.length - 1];
    
    console.log(week)
    // dispatch(weekIncrease()) ? week < max : null;
    dispatch(weekIncrease());
  }

  decrease() {
    const { dispatch } = this.props;
    let min = weeks[0];

    // dispatch(weekIncrease()) ? week > min : null;
    dispatch(weekDecrease())
  }

  render() {
    const { week } = this.props;
    return (
      <div className={ `${ styles }` }>
        <div className='decrease'
          onClick={ () => this.decrease() }>-</div>
        { week }
        <div className='increase'
          onClick={ () => this.increase() }>+</div>
      </div>
    );
  }
}

function select(state) {
  function getWeeks(data) {
    let weeks = [];

    data.items.map((shop) => {
      weeks.push(shop.Week);
    });

    return _.uniq(weeks);
  }

  return {
    weeks: getWeeks(state.weeks),
    week: state.shops.week,
  };
}

export default connect(select)(Weeks);
