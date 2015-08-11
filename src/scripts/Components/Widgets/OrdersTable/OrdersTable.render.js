import Helpers from '../../../Utils/helpers.js';

export default class ordersWidget {

  static tableChart(options) {
    var title = null;
    var footer = null;
    var highlightRows = null;
    var tdWidths = null;

    function chart(selection) {
      var updates = [];
      selection.each(function(data) {
        var sel = d3.select(this);
        sel.selectAll( '.title' ).remove();
        sel.selectAll( 'table' ).remove();
        sel.style('opacity', 0)
          .transition()
          .duration(800)
          .style('opacity', 1);
          
        var tdwidth = function(k) {
          return tdWidths && k in tdWidths ? tdWidths[k] : 'null';
        };

        if (title) {
          sel.append('div')
            .attr('class', 'title')
            .text(title);
        }

        var table = sel.append('table')
          .attr('cellspacing', '0px')
          .attr('cellpadding', '0px');

        var thead, rows, cells, tfoot;
        createBody();
        if (footer) {
          createFooter();
        }


        function checkHighlight(d) {
          if (highlightRows) {
            var retVal = null;
            highlightRows.forEach(function(row) {
              if (row.name === d.key) {
                retVal = row.criterion(d.value) ? row.color : null;
                return;
              }
            });
            return retVal;
          } else {
            return null;
          }
        }

        function update( transitionDuration ) {
          data = sel[0][0].__data__

          // if ( transitionDuration ) {
              // updateBody( transitionDuration );
          // }
          // else {
              table.selectAll("tr, thead, tfoot").remove();
              createBody();
              if ( footer ) { createFooter(); }
          // }
        }

        function createBody() {
          thead = table.append('thead').append('tr');
          thead.selectAll('td')
            .data(d3.keys(data[0]))
            .enter()
            .append('td')
            .style("width", function(d) {
              return tdwidth(d);
            })
            .text(function(d) {
              return d;
            });

          rows = table.selectAll(".dataRows")
            .data(data)
            .enter()
            .append("tr");

          cells = rows.selectAll("td")
            .data(function(d) {
              return d3.entries(d);
            })
            .enter()
            .append("td")
            .attr("class", function(d, i) {
              return i === 0 ? null : 'value'
            })
            .style("color", checkHighlight)
            .text(function(d) {
              return d.value;
            });
        }

        function updateBody( transitionDuration ) {

            rows.data( data );

            cells.data( function(d) { return d3.entries(d); } )
            .transition()
            .duration( transitionDuration )
            .tween("text", function(d,i) {
                var val = d3.interpolate( parseFloat( this.textContent ), parseFloat(d.value) );
                return function(t) { this.textContent =  i === 0 ? d.value : Math.round(val(t)); }
            })
            .style( "color", checkHighlight );

            tfoot.selectAll('td')
                .data( d3.entries( footer ) )
                .transition()
                .duration( transitionDuration )
                .style( "color", checkHighlight )
                .tween("text", function(d,i) {
                    var val = d3.interpolate( parseFloat( this.textContent ), parseFloat(d.value) );
                    return function(t) { this.textContent =  i === 0 ? d.value : Math.round(val(t)); }
                });
        }

        function createFooter() {
          var tfoot = table.append('tfoot').append('tr');

          tfoot.selectAll('td')
            .data(d3.entries(footer))
            .enter()
            .append('td')
            .attr("class", function(d, i) {
              return i === 0 ? null : 'value'
            })
            .style("color", checkHighlight)
            .text(function(d) {
              return d.value;
            });
        }

        updates.push(update);
      });
      return {
        update: function(transitionDuration) {
          updates.forEach(function(up) {
            up( transitionDuration );
          });
          return this;
        },
        title: function(newTitle) {
          title = newTitle;
          return this;
        },
        footer: function(newFooter) {
          footer = newFooter;
          return this;
        }
      };

    }
    chart.header = function(_) {
      if (!arguments.length) return header;
      header = _;
      return chart;
    };

    chart.footer = function(_) {
      if (!arguments.length) return footer;
      footer = _;
      return chart;
    };

    chart.title = function(_) {
      if (!arguments.length) return title;
      title = _;
      return chart;
    };

    chart.highlightRows = function(_) {
      if (!arguments.length) return highlightRows;
      highlightRows = _;
      return chart;
    };

    chart.tdWidths = function(_) {
      if (!arguments.length) return tdWidths;
      tdWidths = _;
      return chart;
    };

    return chart;
  }

}