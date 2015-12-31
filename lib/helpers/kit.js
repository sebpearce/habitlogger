'use strict';

const kit = {

  log (s, name) {
    name = name ? name + ': ' : '';
    console.log(name + ((typeof s === 'object') ? JSON.stringify(s) : s));
  },

  padWithZeroes (x) {
    return (+x < 10) ? '0' + x : x;
  },

  getYYYYMMDD (date) {
    let yyyy = date.getFullYear().toString();
    let mm = (date.getMonth()+1).toString();
    let dd = date.getDate().toString();
    return yyyy + '-' + this.padWithZeroes(mm) + '-' + this.padWithZeroes(dd);
  },

  // replace with arrow fn
  convertValueToCounted (v) {
    // return '\u00D7 ' + v;
    return 'x ' + v;
  },

  convertValueToBinary (v) {
    return +v ? 'Yes' : 'No';
    // return '';
  },

  convertValueToTime (sec) {
    let hr = Math.floor(sec / 3600);
    sec -= hr * 3600;
    hr = (hr >= 1) ? (hr + 'hr') : '';
    let min = Math.floor(sec / 60);
    min = (min >= 1) ? (min + 'min') : '';
    let remSec = sec % 60;
    remSec = (remSec !== 0) ? (remSec + 'sec') : '';
    let result = (hr + min + remSec).replace(/(\D)(\d)/g, '$1 $2');
    result = result.replace(/(\d)(\D)/g, '$1 $2');
    return result;
  },

  convertValueToType (value, type) {
    if (type == 3) {
      return this.convertValueToBinary(value);
    }
    if (type == 2) {
      return this.convertValueToCounted(value);
    }
    if (type == 1) {
      return this.convertValueToTime(value);
    }
    return 0;
  },

  formatValues (input, habitType) {
    // arrays
    if (Array.isArray(input)) {
      for (let row of input) {
        row.value = this.convertValueToType(row.value, row.type);
      }
    // objects
    } else if (typeof(input) === 'object') {
      for (let prop in input) {
        input[prop].value = this.convertValueToType(input[prop].value, input[prop].type);
      }
    } 
  },

};

module.exports = kit;
