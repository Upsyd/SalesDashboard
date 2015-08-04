import React, { Component } from 'react';

// Component styles
import 'style!./Styles/Weeks.scss';
let styles = require('./Styles/Weeks.scss').locals.styles;

export default class Weeks extends Component {
  render() {
    return (
      <div className={ `${ styles }` }>
        Weeks
      </div>
    );
  }
}
