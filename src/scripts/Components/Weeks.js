import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setShops } from '../Actions/Actions.js';

// Component styles
import 'style!./Styles/Weeks.scss';
let styles = require('./Styles/Weeks.scss').locals.styles;

class Weeks extends Component {
  handleClick() {
    let xxx = {
      Year: '2019999',
      Week: '18',
      Orglevel1: 'SWEDEN',
      Orglevel2: 'GAVNO',
      Orglevel3: 'STORE4',
    }
    this.props.dispatch(setShops(xxx))
  }
  render() {
    return (
      <div className={ `${ styles }` }>
        <select className='selectpicker'>
          { this.props.shops.map((shop) => {
            return <option>
                { shop.Week }
              </option>
          })}
        </select>
        <div onClick={ e => this.handleClick(e) }>123</div>
      </div>
    );
  }
}

function select(state) {
  return {
    shops: state.shops
  };
}

export default connect(select)(Weeks);