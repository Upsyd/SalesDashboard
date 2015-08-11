import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';

// Renders
import Dashboard from './Dashboard.render.js';

// Component styles
import 'style!./Styles/Shops.scss';
let styles = require('./Styles/Shops.scss').locals.styles;

class Shops extends Component {
  render() {
    return (
      <div className={ `${ styles }` }>
        <CountriesList { ...this.props } />
      </div>
    );
  }
}

class CountriesList extends Component {
  
  selectCountry(country) {
    Dashboard.applyFilter({ Orglevel1: country });
    Dashboard.update(500);
  }

  render() {
    const { countries } = this.props;
    return (
      <div className='countries'>
        { countries.map((country) => {
          return (
            <p className='country active'>
              { country }
              <CitiesList { ...this.props } />
            </p>
          );
        })}
      </div>
    );
  }
}

class CitiesList extends Component {
  
  selectCity(city) {
    Dashboard.applyFilter({ Orglevel2: city });
    Dashboard.update(500);
  }

  render() {
    const { cities } = this.props;
    return (
      <div className='cities'>
        { cities.map((city) => {
          return (
            <p className='city'
              onClick={ () => this.selectCity(city) }>
              { city }
              <ShopsList { ...this.props } />
            </p>
          );
        })}
      </div>
    );
  }
}

class ShopsList extends Component {

  selectShop(shop) {
    Dashboard.applyFilter({ Orglevel3: shop });
    Dashboard.update(500);
  }

  render() {
    const { shops } = this.props;
    return (
      <div className='shops'>
        { shops.map((shop) => {
          return (
            <p className='shop'
              onClick={ () => this.selectShop(shop) }>
              { shop }
            </p>
          );
        })}
      </div>
    );
  }
}

function select(state) {
  function getCountries(data) {
    let countries = [];

    data.items.map((shop) => {
      countries.push(shop.Orglevel1);
    });

    return _.uniq(countries);
  };

  function getCities(data) {
    let cities = [];

    data.items.map((shop) => {
      cities.push(shop.Orglevel2);
    });

    return _.uniq(cities);
  };

  function getShop(data) {
    let shops = [];

    data.items.map((shop) => {
      shops.push(shop.Orglevel3);
    });

    return _.uniq(shops);
  };

  return {
    // shops: state.shops,
    countries: getCountries(state.shops),
    cities: getCities(state.shops),
    shops: getShop(state.shops),
  };
}

export default connect(select)(Shops);