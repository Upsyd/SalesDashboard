import $ from 'jquery';
import Helpers from '../Utils/helpers.js';

let itemsData = [];

$.ajax({
  url: '../../../CSV/Org.csv',
  async: false,
  success: function(csv) {
    itemsData = JSON.parse(Helpers.CSV2JSON(csv, ';'));
  },
  dataType: 'text',
});

let shops = {
  week: 17,

  // Default
  currentCountry: '',
  currentCity: '',
  currentShop: 'STORE1',

  items: itemsData
};

module.exports = shops;