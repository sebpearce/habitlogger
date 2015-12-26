const express = require('express');
const app = module.exports = express();

module.exports = {

  getIndexPage (res) {
    const opts = {
      pageTitle: 'Index',
    };
    res.render('index', opts);
  },

}