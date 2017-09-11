let getInfo = (data) => {
    let lat = data.results[0].geometry.location.lat
    let lng = data.results[0].geometry.location.lng
    let formatted_address = data.results[0].formatted_address
  
    return{
      lat,
      lng,
      formatted_address
    }
  }

  module.exports = getInfo