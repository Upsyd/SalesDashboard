import Helpers from '../../../Utils/helpers.js';

export default class performanceWidget {

  static ordersWidget(data) {
      var tableData = prepareData(data);

      var rowsToHighlight = [{
        name: '% of',
        color: 'red',
        criterion: highlightCriterion
      }, {
        name: '% of (PY)',
        color: 'red',
        criterion: highlightCriterion
      }, {
        name: 'Target',
        color: 'orange',
        criterion: function() {
          return true;
        }
      }, {
        name: 'Target (PY)',
        color: 'orange',
        criterion: function() {
          return true;
        }
      }];

      var cellWidths = {
        'Product': '20%',
        'Orders': '16%',
        '% of': '16%',
        'Target': '16%',
        '% of (PY)': '16%',
        'Target (PY)': '16%'
      };

      var selection = d3.select('#Orders');
      var table = tableChart().title('Orders').footer(tableData[1]).tdWidths(cellWidths).highlightRows(rowsToHighlight)(selection.datum(tableData[0]));

      Dashboard.widgets.push({
        type: "DataTable",
        name: "Orders",
        obj: table,
        selection: selection,
        rawData: data,
        preparedData: tableData,
        title: function(title) {
          this.obj.title(title);
        },
        // data: function( data ) { this.rawData = data; this.preparedData = prepareData( this.rawData ); this.selection.datum( this.preparedData[0] ); this.obj.footer( preparedData[1] ); },
        filter: function(filterObj) {
          this.preparedData = prepareData(this.rawData);
          this.selection.datum(this.preparedData[0]);
          this.obj.footer(preparedData[1]);
        },
        update: function(transitionDuration) {
          this.obj.update(transitionDuration);
        }
      });

      function prepareData(data, filterObj) {
        var filterObj = filterObj ? filterObj : {};
        var dataFiltered = filterData(data, filterObj);
        calcAdditionalOrdersData(dataFiltered, data); // For previous Year

        var dataGrouped = _.groupBy(dataFiltered, 'Product');

        var dataReduced = [];
        for (var key in dataGrouped) {
          dataReduced.push({
            'Product': key,
            'Ordersnum': d3.sum(dataGrouped[key], function(d) {
              return isNumber(d.Ordersnum) ? d.Ordersnum : 0;
            }),
            'Orderstargetnum': d3.sum(dataGrouped[key], function(d) {
              return isNumber(d.Orderstargetnum) ? d.Orderstargetnum : 0;
            }),
            'Orderstargetnumprev': d3.sum(dataGrouped[key], function(d) {
              return isNumber(d.Orderstargetnumprev) ? d.Orderstargetnumprev : 0;
            }),
          });
        }

        var bodyData = _.map(dataReduced, function(d) {
          return {
            // 'Location': d.Orglevel1 + ' ' + d.Orglevel2 + ' ' + d.Orglevel3,
            'Product': d.Product,
            'Orders': +d.Ordersnum,
            '% of': isNumber(+d.Ordersnum / d.Orderstargetnum) ? formatValue(+d.Ordersnum / d.Orderstargetnum * 100) + '%' : '',
            'Target': +d.Orderstargetnum,
            '% of (PY)': isNumber(+d.Ordersnum / d.Orderstargetnumprev) ? formatValue(+d.Ordersnum / d.Orderstargetnumprev * 100) + '%' : '',
            'Target (PY)': isNumber(d.Orderstargetnumprev) ? +d.Orderstargetnumprev : ''
          }
        });

        var footerData = {
          'Product': 'TOTAL',
          'Orders': null,
          '% of': null,
          'Target': null,
          '% of (PY)': null,
          'Target (PY)': null
        };
        footerData['Orders'] = d3.sum(dataReduced, function(d) {
          return +d.Ordersnum;
        });
        footerData['Target'] = d3.sum(dataReduced, function(d) {
          return +d.Orderstargetnum;
        });
        footerData['Target (PY)'] = d3.sum(dataReduced, function(d) {
          return +d.Orderstargetnumprev;
        });
        footerData['% of'] = isNumber(footerData['Orders'] / footerData['Target']) ? formatValue(footerData['Orders'] / footerData['Target'] * 100) + '%' : '';
        footerData['% of (PY)'] = isNumber(footerData['Orders'] / footerData['Target (PY)']) ? formatValue(footerData['Orders'] / footerData['Target (PY)'] * 100) + '%' : '';

        return [bodyData, footerData];

      }

      function highlightCriterion(d) {
        return parseFloat(d) < 100;
      }

      function calcAdditionalOrdersData(dataFiltered, data) {
        _.each(dataFiltered, function(d, i) {
          var prevYearElement = _.findWhere(data, {
            Year: d.Year - 1,
            Week: d.Week,
            Product: d.Product,
            Orglevel1: d.Orglevel1,
            Orglevel2: d.Orglevel2,
            Orglevel3: d.Orglevel3
          });

          if (prevYearElement) {
            d.Orderstargetnumprev = prevYearElement.Orderstargetnum;
          } else {
            d.Orderstargetnumprev = null;
          }
        });
      }
    },

}