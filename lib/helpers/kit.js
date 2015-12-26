'use strict';

const kit = {

  log (s, name) {
    name = name ? name + ': ' : '';
    console.log(name + ((typeof s === 'object') ? JSON.stringify(s) : s));
  },

  // replace with arrow fn
  convertValueToCounted (v) {
    return '\u00D7 ' + v;
  },

  convertValueToBinary (v) {
    return +v ? 'Yes' : 'No';
  },

  convertValueToTime (sec) {
    let hr = Math.floor(sec / 3600);
    sec -= hr * 3600;
    hr = (hr >= 1) ? (hr + 'h') : '';
    let min = Math.floor(sec / 60);
    min = (min >= 1) ? (min + 'm') : '';
    let remSec = sec % 60;
    remSec = (remSec !== 0) ? (remSec + 's') : '';
    return hr + min + remSec;
  },

  formatValues (obj) {
    for (let row of obj) {
      if (row.type === 1) {
        row.value = this.convertValueToTime(row.value);
      }    
      if (row.type === 2) {
        row.value = this.convertValueToCounted(row.value);
      }
      if (row.type === 3) {
        row.value = this.convertValueToBinary(row.value);
      }
    }
  }

};

module.exports = kit;
