import $ from 'jquery';
import Papa from 'papaparse';


let itemsData = [];

$.ajax({
  url: 'CSV/Org.csv',
  async: false,
  success: function(csv) {
    itemsData = Papa.parse(csv, { header: true, skipEmptyLines: true }).data;
  },
  dataType: 'text',
});

let shops = {
  week: 17,

  // Default
  currentCountry: '',
  currentCity: '',
  currentShop: '',

  items: itemsData
};

module.exports = shops;