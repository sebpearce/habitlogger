const kit = {

  log (s, name) {
    name = name ? name + ': ' : '';
    console.log(name + ((typeof s === 'object') ? JSON.stringify(s) : s));
  },

};

module.exports = kit;
