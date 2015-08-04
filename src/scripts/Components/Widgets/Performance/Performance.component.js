import React, { Component } from 'react';

// Component styles
import 'style!./Performance.scss';
let styles = require('./Performance.scss').locals.styles;

export default class Performance extends Component {
  render() {
    let { className } = this.props;
    return (
      <div className={ `${ className } ${ styles }` }>
        Performance in DOM
      </div>
    );
  }
}
