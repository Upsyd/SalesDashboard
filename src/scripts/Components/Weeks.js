import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';

import { weekIncrease, weekDecrease } from '../Actions/Actions.js';

// Component styles
import 'style!./Styles/Weeks.scss';
let styles = require('./Styles/Weeks.scss').locals.styles;

// Renders
import Dashboard from './Dashboard.render.js';

class Weeks extends Component {

  increase() {
    const { week, year, weeks, dispatch } = this.props;
    let max = weeks[weeks.length - 1];
    
    dispatch(weekIncrease());
    this.update( week+1 > 53 ? 1 : week+1, week+1 > 53 ? year+1 : year );
  }

  decrease() {
    const { week, year, weeks, dispatch } = this.props;
    let min = weeks[0];

    dispatch(weekDecrease());
    this.update( week-1 < 1 ? 53 : week-1, week-1 < 1 ? year-1 : year );
  }

  update( week,year ) {
    const { data } = this.props;
    let currentCountry = data.currentCountry,
        currentCity = data.currentCity,
        currentShop = data.currentShop;

    var filterObj = { Year: year, Week: week };
    if ( currentCountry ) filterObj.Orglevel1 = currentCountry;
    if ( currentCity )    filterObj.Orglevel2 = currentCity;
    if ( currentShop )    filterObj.Orglevel3 = currentShop;

    Dashboard.applyFilter( filterObj );
    Dashboard.update(800);
  }

  render() {
    const { week } = this.props;
    return (
      <div className={ `${ styles } row` }>
        <div>
          <h4>Weeks</h4>
        </div>
        <div className='decrease'
          onClick={ () => this.decrease() }>-</div>
        <div className='currentWeek'>
          { week }
        </div>
        <div className='increase'
          onClick={ () => this.increase() }>+</div>
      </div>
    );
  }
}

function select(state) {
  function getWeeks(data) {
    // let weeks = [];

    // data.items.map((shop) => {
    //   weeks.push(shop.Week);
    // });

    // return _.uniq(weeks);
    var arr = Array.apply(null, Array(53));
    return arr.map(function (x, i) { return i+1 });

    return arr;
  }

  return {
    weeks: getWeeks(state.weeks),
    week: state.weeks.week,
    year: state.weeks.year,
    data: state.application,
  };
}

export default connect(select)(Weeks);
