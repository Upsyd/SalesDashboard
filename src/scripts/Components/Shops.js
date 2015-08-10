import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setShops } from '../Actions/Actions.js';

// Component styles
import 'style!./Styles/Shops.scss';
let styles = require('./Styles/Shops.scss').locals.styles;
var xxx = {
  Year: '2019999',
  Week: '18',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'GAVNO',
  Orglevel3: 'STORE4',
}

class Shops extends Component {
  render() {
    const { dispatch } = this.props;
    return (
      <div className={ `${ styles } list-group` }>
        { this.props.shops.map((shop) => {
          return <a href='#' className='list-group-item'>
            { shop.Orglevel1 }, { shop.Orglevel2 }, { shop.Orglevel3 }
          </a>
        })}
      <div onClick={ () => dispatch(setShops(xxx)) }>123</div>
      </div>
    );
  }
}

function select(state) {
  return {
    shops: state.shops
  };
}

export default connect(select)(Shops);