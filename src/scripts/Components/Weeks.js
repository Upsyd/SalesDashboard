import React, { Component } from 'react';

// Component styles
import 'style!./Styles/Weeks.scss';
let styles = require('./Styles/Weeks.scss').locals.styles;

// Temp data
let data = [{
  Year: '2015',
  Week: '17',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'STOCKHOLM',
  Orglevel3: 'STORE1',
}, {
  Year: '2015',
  Week: '17',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'STOCKHOLM',
  Orglevel3: 'STORE1',
}, {
  Year: '2015',
  Week: '17',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'STOCKHOLM',
  Orglevel3: 'STORE1',
}, {
  Year: '2015',
  Week: '17',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'STOCKHOLM',
  Orglevel3: 'STORE2',
}, {
  Year: '2015',
  Week: '17',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'STOCKHOLM',
  Orglevel3: 'STORE2',
}, {
  Year: '2015',
  Week: '17',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'STOCKHOLM',
  Orglevel3: 'STORE2',
}, {
  Year: '2015',
  Week: '17',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'MALMÖ',
  Orglevel3: 'STORE3',
}, {
  Year: '2015',
  Week: '17',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'MALMÖ',
  Orglevel3: 'STORE3',
}, {
  Year: '2015',
  Week: '17',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'MALMÖ',
  Orglevel3: 'STORE3',
}, {
  Year: '2015',
  Week: '17',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'MALMÖ',
  Orglevel3: 'STORE4',
}, {
  Year: '2015',
  Week: '17',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'MALMÖ',
  Orglevel3: 'STORE4',
}, {
  Year: '2015',
  Week: '17',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'MALMÖ',
  Orglevel3: 'STORE4',
}, {
  Year: '2015',
  Week: '18',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'STOCKHOLM',
  Orglevel3: 'STORE1',
}, {
  Year: '2015',
  Week: '18',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'STOCKHOLM',
  Orglevel3: 'STORE1',
}, {
  Year: '2015',
  Week: '18',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'STOCKHOLM',
  Orglevel3: 'STORE1',
}, {
  Year: '2015',
  Week: '18',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'STOCKHOLM',
  Orglevel3: 'STORE2',
}, {
  Year: '2015',
  Week: '18',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'STOCKHOLM',
  Orglevel3: 'STORE2',
}, {
  Year: '2015',
  Week: '18',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'STOCKHOLM',
  Orglevel3: 'STORE2',
}, {
  Year: '2015',
  Week: '18',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'MALMÖ',
  Orglevel3: 'STORE3',
}, {
  Year: '2015',
  Week: '18',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'MALMÖ',
  Orglevel3: 'STORE3',
}, {
  Year: '2015',
  Week: '18',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'MALMÖ',
  Orglevel3: 'STORE3',
}, {
  Year: '2015',
  Week: '18',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'MALMÖ',
  Orglevel3: 'STORE4',
}, {
  Year: '2015',
  Week: '18',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'MALMÖ',
  Orglevel3: 'STORE4',
}, {
  Year: '2015',
  Week: '18',
  Orglevel1: 'SWEDEN',
  Orglevel2: 'MALMÖ',
  Orglevel3: 'STORE4',
}];

export default class Weeks extends Component {
  render() {
    return (
      <div className={ `${ styles }` }>
        <select className='selectpicker'>
          { data.map((shop) => {
            return <option>
                { shop.Week }
              </option>
          })}
        </select>
      </div>
    );
  }
}
