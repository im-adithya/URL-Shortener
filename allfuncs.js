function refiner (x) {
  
    if (/^http/.test(x)){
      return x.split('://')[1]
    }
    return 'something else'
  }
  module.exports.refiner = refiner