import React, { Component } from 'react';
import { connect } from 'react-redux';

import _ from 'underscore';

// Actions
import { getApplicationData, setApplicationSettings } from '../Actions/Actions.js';

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
    const { dispatch, week, year } = this.props;
    dispatch(setApplicationSettings(null, null, country));

    Dashboard.applyFilter({ Orglevel1: country, Year: year, Week: week });
    Dashboard.update(800);
  }

  render() {
    let { data, currentCountry } = this.props;
    let countries = _(data.items).chain().flatten().pluck('Orglevel1').unique().value(),
        active;
    if ( !currentCountry )
      currentCountry = countries[0];
    return (
      <div className='countries'>
        { countries.map((country) => {
          { active = country === currentCountry ? 'active' : ''; }
          return (
            <ul className='country'>
              <li className={ active } onClick={ () => this.selectCountry(country) }>
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
    let { data } = this.props;

    return _.uniq(_.uniq(data.items).slice(0, _.uniq(data.items).length - 1).map((shop) => {
      return  shop.Orglevel2 !== '' ? shop.Orglevel2 : null;
    }));
  }

  selectCity(city) {
    const { dispatch, week, year } = this.props;
    dispatch(setApplicationSettings(null, city));

    Dashboard.applyFilter({ Orglevel2: city, Year: year, Week: week });
    Dashboard.update(800);
  }

  render() {
    const { currentCity } = this.props;
    let cities = this.getCities(),
        active;
    return (
      <div className='cities'>
        { cities.map((city) => {
          { active = city === currentCity ? 'active' : ''; }
          return (
            <ul className='city'>
              <li className={ active }
                  onClick={ () => this.selectCity(city) }>
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
      return  shop.Orglevel3 !== '' ? shop.Orglevel3 : null;
    });
  }

  selectShop(shop, event) {
    const { dispatch, week, year } = this.props;
    dispatch(setApplicationSettings(shop));

    Dashboard.applyFilter({ Orglevel3: shop, Year: year, Week: week });
    Dashboard.update(800);
  }

  render() {
    const { currentShop } = this.props;
    let shops = this.getShops(),
        active = '';
    return (
      <div className='shops'>
        { shops.map((shop) => {
          { active = shop === currentShop ? 'active' : ''; }
          return (
            <ul className='shop'>
              
              <li className={ active }
                  onClick={ () => this.selectShop(shop, this) }>
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
  return {
    data: state.shops,
    week: state.weeks.week,
    year: state.weeks.year,
    currentShop: state.application.currentShop,
    currentCity: state.application.currentCity,
    currentCountry: state.application.currentCountry
  };
}

export default connect(select)(Shops);
