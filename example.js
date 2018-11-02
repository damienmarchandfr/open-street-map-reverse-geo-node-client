const Geo = require('./dist')

const reverse = new Geo.ReverseGeocoder('45.777210', '3.082520')

reverse.getReverse()
    .then((location)=>{console.log(location)})
    .catch(err=>{console.error(err)})