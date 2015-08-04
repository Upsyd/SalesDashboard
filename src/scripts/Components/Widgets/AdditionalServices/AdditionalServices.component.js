import React, { Component } from 'react';

// Component styles
import 'style!./AdditionalServices.scss';
let styles = require('./AdditionalServices.scss').locals.styles;

export default class AdditionalServices extends Component {
  render() {
    let { className } = this.props;
    return (
      <div className={ `${ className } ${ styles }` }>
        AdditionalServices in DOM
      </div>
    );
  }
}
