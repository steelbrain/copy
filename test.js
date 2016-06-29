a = require('./')
b = a('./lib/index.js', './index2')
b.then(function() {
  console.log('successful')
}, function() {
  console.log('error')
})
