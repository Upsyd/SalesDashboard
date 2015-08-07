import React, { Component } from 'react';

// Component styles
import 'style!./Styles/Shops.scss';
let styles = require('./Styles/Shops.scss').locals.styles;

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

export default class Shops extends Component {
  render() {
    return (
      <div className={ `${ styles } list-group` }>
        { data.map((shop) => {
          return <a href='#' className='list-group-item'>
            { shop.Orglevel1 }, { shop.Orglevel2 }, { shop.Orglevel3 }
          </a>
        })}
      </div>
    );
  }
}
