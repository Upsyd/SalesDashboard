import _ from 'underscore';

export default class Helpers {

  static isNumber(n) {
    return (n !== null) && (typeof n !== 'undefined') && isFinite(n) && !isNaN(n);
  }

  static filterData(data, filterObj) {
    return _.where(data, filterObj);
  }

  // http://stackoverflow.com/questions/4647817/javascript-object-rename-key
  static renameProperty(obj, oldName, newName) {
    // Do nothing if the names are the same
    if (oldName == newName) {
      return obj;
    }
    // Check for the old property name to avoid a ReferenceError in strict mode.
    if (obj.hasOwnProperty(oldName)) {
      obj[newName] = obj[oldName];
      obj['key'] = oldName;
      delete obj[oldName];
    }
    return obj;
  }

  static numberWithSeparator(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  static formatValue(value) {
    if (isNaN(value) || !isFinite(value)) {
      return '';
    }
    var formattedValue;

    // if ( Math.abs( value ) > 1000000 )  formattedValue = numberWithSeparator( Math.round( value/1000 ) ) + 'K';
    if (Math.abs(value) > 100) {
      formattedValue = this.numberWithSeparator(Math.round(value));
    } else if (Math.abs(value) > 10) {
      formattedValue = Math.round(value);
    } else {
      formattedValue = Math.round(100 * value) / 100;
    }

    return formattedValue;
  }

  static filterData(data, filterObj) {
    return _.where(data, filterObj);
  }

  static isNumber(n) {
    return (n !== null) && (typeof n !== 'undefined') && isFinite(n) && !isNaN(n);
  }

  // http://stackoverflow.com/questions/4647817/javascript-object-rename-key
  static renameProperty(obj, oldName, newName) {
    // Do nothing if the names are the same
    if (oldName == newName) {
      return obj;
    }
    // Check for the old property name to avoid a ReferenceError in strict mode.
    if (obj.hasOwnProperty(oldName)) {
      obj[newName] = obj[oldName];
      obj['key'] = oldName;
      delete obj[oldName];
    }
    return obj;
  }

  // Source: http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
  // This will parse a delimited string into an array of
  // arrays. The default delimiter is the comma, but this
  // can be overriden in the second argument.
  static CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp((
      // Delimiters.
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
      // Standard fields.
      "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [
      []
    ];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
      // Get the delimiter that was found.
      var strMatchedDelimiter = arrMatches[1];
      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
        // Since we have reached a new row of data,
        // add an empty row to our data array.
        arrData.push([]);
      }
      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      if (arrMatches[2]) {
        // We found a quoted value. When we capture
        // this value, unescape any double quotes.
        var strMatchedValue = arrMatches[2].replace(
          new RegExp("\"\"", "g"), "\"");
      } else {
        // We found a non-quoted value.
        var strMatchedValue = arrMatches[3];
      }
      // Now that we have our value string, let's add
      // it to the data array.
      arrData[arrData.length - 1].push(strMatchedValue);
    }
    // Return the parsed data.
    return (arrData);
  }

  static CSV2JSON(csv, strDelimiter) {
    var array = this.CSVToArray(csv, strDelimiter);
    var objArray = [];
    for (var i = 1; i < array.length; i++) {
      objArray[i - 1] = {};
      for (var k = 0; k < array[0].length && k < array[i].length; k++) {
        var key = array[0][k];
        objArray[i - 1][key] = array[i][k]
      }
    }

    var json = JSON.stringify(objArray);
    var str = json.replace(/},/g, "},\r\n");

    return str;
  }

  // http://stackoverflow.com/questions/16590500/javascript-calculate-date-from-week-number
  // static getDateOfISOWeek(w, y) {
  //   var simple = new Date(y, 0, 1 + (w - 1) * 7);
  //   var dow = simple.getDay();
  //   var ISOweekStart = simple;
  //   if (dow <= 4)
  //       ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  //   else
  //       ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  //   return ISOweekStart;
  // }

  //http://stackoverflow.com/questions/16590500/javascript-calculate-date-from-week-number
  // static getDateOfWeek(w, y) {
  //   var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week

  //   return new Date(y, 0, d);
  // }

}