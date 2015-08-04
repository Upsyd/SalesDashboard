import React, { Component } from 'react';

// Component styles
import 'style!./Styles/Shops.scss';
let styles = require('./Styles/Shops.scss').locals.styles;

export default class Shops extends Component {
  render() {
    return (
      <div className={ `${ styles }` }>
        <div className='list-group'>
          <a href='#' className='list-group-item active'>
            0
          </a>
          <a href='#' className='list-group-item'>1</a>
          <a href='#' className='list-group-item'>2</a>
        </div>
      </div>
    );
  }
}
