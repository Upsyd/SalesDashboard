import 'd3';
import Helpers from '../../../Utils/helpers.js';
import Dashboard from '../../../Dashboard.render.js';

export default class performanceWidget {

  static additionalServicesWidget(data) {
      var tableData = prepareData(data);

      var selection = d3.select('#AdditionalServices');
      var table = tableChart().title('Additional Services').footer(tableData[1])(selection.datum(tableData[0]));

      Dashboard.widgets.push({
        type: "DataTable",
        name: "AdditionalServices",
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
        var dataGrouped = _.groupBy(dataFiltered, 'Product');

        var dataReduced = [];
        for (var key in dataGrouped) {
          dataReduced.push({
            'Product': key,
            'OrdersNumA': d3.sum(dataGrouped[key], function(d) {
              return isNumber(d.OrdersNumA) ? d.OrdersNumA : 0;
            }),
            'ServicesNumA': d3.sum(dataGrouped[key], function(d) {
              return isNumber(d.ServicesNumA) ? d.ServicesNumA : 0;
            }),
            'ServicesNumB': d3.sum(dataGrouped[key], function(d) {
              return isNumber(d.ServicesNumB) ? d.ServicesNumB : 0;
            }),
            'ServicesNumC': d3.sum(dataGrouped[key], function(d) {
              return isNumber(d.ServicesNumC) ? d.ServicesNumC : 0;
            }),
            'ServicesNumD': d3.sum(dataGrouped[key], function(d) {
              return isNumber(d.ServicesNumD) ? d.ServicesNumD : 0;
            }),
            'ServicesNumE': d3.sum(dataGrouped[key], function(d) {
              return isNumber(d.ServicesNumE) ? d.ServicesNumE : 0;
            }),
            'ServicesNumF': d3.sum(dataGrouped[key], function(d) {
              return isNumber(d.ServicesNumF) ? d.ServicesNumF : 0;
            })
          });
        }

        var bodyData = _.map(dataReduced, function(d) {
          return {
            // 'Location': d.Orglevel1 + ' ' + d.Orglevel2 + ' ' + d.Orglevel3,
            'Product': d.Product,
            'A %': isNumber(+d.OrdersNumA / d.ServicesNumA) ? formatValue(+d.OrdersNumA / d.ServicesNumA * 100) + '%' : '',
            'B %': isNumber(+d.OrdersNumA / d.ServicesNumB) ? formatValue(+d.OrdersNumA / d.ServicesNumB * 100) + '%' : '',
            'C %': isNumber(+d.OrdersNumA / d.ServicesNumC) ? formatValue(+d.OrdersNumA / d.ServicesNumC * 100) + '%' : '',
            'D %': isNumber(+d.OrdersNumA / d.ServicesNumD) ? formatValue(+d.OrdersNumA / d.ServicesNumD * 100) + '%' : '',
            'E %': isNumber(+d.OrdersNumA / d.ServicesNumE) ? formatValue(+d.OrdersNumA / d.ServicesNumE * 100) + '%' : '',
            'F %': isNumber(+d.OrdersNumA / d.ServicesNumF) ? formatValue(+d.OrdersNumA / d.ServicesNumF * 100) + '%' : ''
          }
        });

        var footerData = {
          'Product': 'TOTAL',
          'A %': null,
          'B %': null,
          'C %': null,
          'D %': null,
          'E %': null,
          'F %': null
        };
        sumOrdersNumA = d3.sum(dataReduced, function(d) {
          return +d.OrdersNumA;
        });
        sumServicesNumA = d3.sum(dataReduced, function(d) {
          return +d.ServicesNumA;
        });
        footerData['A %'] = isNumber(sumOrdersNumA / sumServicesNumA) ? formatValue(sumOrdersNumA / sumServicesNumA * 100) + '%' : '';
        sumServicesNumB = d3.sum(dataReduced, function(d) {
          return +d.ServicesNumB;
        });
        footerData['B %'] = isNumber(sumOrdersNumA / sumServicesNumB) ? formatValue(sumOrdersNumA / sumServicesNumB * 100) + '%' : '';
        sumServicesNumC = d3.sum(dataReduced, function(d) {
          return +d.ServicesNumC;
        });
        footerData['C %'] = isNumber(sumOrdersNumA / sumServicesNumC) ? formatValue(sumOrdersNumA / sumServicesNumC * 100) + '%' : '';
        sumServicesNumD = d3.sum(dataReduced, function(d) {
          return +d.ServicesNumD;
        });
        footerData['D %'] = isNumber(sumOrdersNumA / sumServicesNumD) ? formatValue(sumOrdersNumA / sumServicesNumD * 100) + '%' : '';
        sumServicesNumE = d3.sum(dataReduced, function(d) {
          return +d.ServicesNumE;
        });
        footerData['E %'] = isNumber(sumOrdersNumA / sumServicesNumE) ? formatValue(sumOrdersNumA / sumServicesNumE * 100) + '%' : '';
        sumServicesNumF = d3.sum(dataReduced, function(d) {
          return +d.ServicesNumF;
        });
        footerData['F %'] = isNumber(sumOrdersNumA / sumServicesNumF) ? formatValue(sumOrdersNumA / sumServicesNumF * 100) + '%' : '';

        return [bodyData, footerData];
      }
    },

}