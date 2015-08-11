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
            <ul className='country'>
              <li onClick={ () => this.selectCountry(country) }>
                { country }
              </li>
              <CitiesList { ...this.props } currentCountry={ country } />
            </ul>
          );
        })}
      </div>
    );
  }
}

class CitiesList extends Component {
  
  getCities() {
    const { data, currentCountry } = this.props;
    return _.where(data.items, { Orglevel1: currentCountry }).map((shop) => {
      return shop.Orglevel2;
    });
  }

  selectCity(city) {
    Dashboard.applyFilter({ Orglevel2: city });
    Dashboard.update(500);
  }

  render() {
    let cities = this.getCities();
    return (
      <div className='cities'>
        { cities.map((city) => {
          return (
            <ul className='city'>
              <li onClick={ () => this.selectCity(city) }>
                { city }
              </li>
              <ShopsList { ...this.props } currentCity={ city } />
            </ul>
          );
        })}
      </div>
    );
  }
}

class ShopsList extends Component {

  getShops() {
    const { data, currentCity } = this.props;
    return _.where(data.items, { Orglevel2: currentCity }).map((shop) => {
      return shop.Orglevel3;
    });
  }

  selectShop(shop) {
    Dashboard.applyFilter({ Orglevel3: shop });
    Dashboard.update(500);
  }

  render() {
    let shops = this.getShops();
    return (
      <div className='shops'>
        { shops.map((shop) => {
          return (
            <ul className='shop'>
              <li onClick={ () => this.selectShop(shop) }>
                { shop }
              </li>
            </ul>
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

  return {
    data: state.shops,
    countries: getCountries(state.shops),
  };
}

export default connect(select)(Shops);