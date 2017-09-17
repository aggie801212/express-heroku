const express = require('express')
const request = require('request');
const getAddress = require('./get-address');

const app = express()
const port = process.env.PORT || 3000

//定義使用ejs
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/homework', function (req, res) {
  let personInfo = {
    name: "陳艾琦",
    email: "aggie1236@gmail.com"
  }
  res.send(personInfo)
})

app.get('/home', function (req, res) {
  res.render('home', {
    title: 'hello world',
    menu: ['abc','bcd','efg'],
  }); 
//           home 路徑預設在views(需要自己新增資料夾)裡面
// 傳值必須用一個object傳入
// ejs會對應傳入的變數名稱對應替換內容
})

const getPlaceInfoGoogle = (location,type) =>{
  let promise = new Promise((resolve,reject) => {
    let url='https://maps.googleapis.com/maps/api/place/nearbysearch/json'
    let options = {
      url: url,
      qs: {
        key: 'AIzaSyBAEnclZn0HdxbuuuSChE8PJqB2_B3twjc',
        location: location,
        radius: '1000',
        type: type,
      },
      method: 'GET'
    }
    request(options,
      function(error, response, body){
        if(error){
          reject(error)
        }else{
          resolve(body)
        }
    })
  })
  return promise;
}

const getPlaceInfoFacebook = (center) =>{
  let promise = new Promise((resolve,reject) => {
    let url='https://graph.facebook.com/v2.10/search'
    let options = {
      url: url,
      qs: {
        type: 'place',
        access_token: 'EAACVqOGHXOwBAPp4Ehur7vMMh5cVZCAcH870Rn6sQCEZCOviC8VRU56SXw8qQbwJNllztG3qj1FNUdNqvbN3ZAPourHse3xDWuUhDDPz1totnpiiIT9VMLQPkhjD7D5AAyiZA1ekg8ZBhSfRg2tlxFrSPRvDQI4fGpgDx9poTwUkCoY5bSyv6RcyqiAy34lfDQSVppbcy8wZDZD',
        center: center,
        fields: 'category_list,about,name,description',
      },
      method: 'GET'
    }
    request(options,
      function(error, response, body){
        if(error){
          reject(error)
        }else{
          resolve(body)
        }
    })
  })
  return promise;
}

app.get('/query-place',function(req,res){
  let location = req.query.location
  let type = req.query.type
  let promise1 = getPlaceInfoGoogle(location,type)
  let promise2 = getPlaceInfoFacebook(location)
  Promise.all([promise1,promise2]).then((result) =>{
    res.send({
      google: JSON.parse(result[0]),
      facebook: JSON.parse(result[1]),
    })
  });
})

app.get('/query-address', function (req, res) {
  let address = req.query.address
  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}`
  request(url, 
      function (error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response.statusCode);
    console.log('body:', body);
    res.send(getAddress(JSON.parse(body)));//字串轉成object
});
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
})

//ejs note
//.ejs 內容等於 .html 的格式 只是增加挖空塞變數的地方
//ejs 使用 <% var %> 來使用塞變數或是做判斷式也可以

//ex:

// <% if (user) { %>
//   <h2><%= user.name %></h2>
// <% } %>
// <ul>
//   <% users.forEach(function(user){ %>
//     <%- include('user/show', {user: user}); %>
//   <% }); %>
// </ul>