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
    
    // if (week < max) {
      dispatch(weekIncrease());
    // }
    this.update( week+1 > 53 ? 1 : week+1);
  }

  decrease() {
    const { week, weeks, dispatch } = this.props;
    let min = weeks[0];

    // if (week > min) {
      dispatch(weekDecrease());
    // }
    this.update( week-1 < 1 ? 53 : week-1 );
  }

  update( week ) {
    const { data } = this.props;
    let currentCountry = data.currentCountry,
        currentCity = data.currentCity,
        currentShop = data.currentShop;

    var filterObj = { Year: 2015, Week: week };
    if ( currentCountry ) filterObj.Orglevel1 = currentCountry;
    if ( currentCity )    filterObj.Orglevel2 = currentCity;
    if ( currentShop )    filterObj.Orglevel3 = currentShop;

    console.log( "Week selected: ", week );


    Dashboard.applyFilter( filterObj );
    Dashboard.update(500);

    // console.log( data );
    // console.log('currentCountry ' + currentCountry);
    // console.log('currentCity ' + currentCity);
    // console.log('currentShop ' + currentShop);
  }

  render() {
    const { week } = this.props;
    return (
      <div className={ `${ styles } row` }>
        <div className='col-md-12 col-lg-12'>
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
    data: state.application,
  };
}

export default connect(select)(Weeks);
