const express = require('express');
const request = require('request');

const PORT = process.env.PORT || 5000;

const app = express();

function getUser(callback) {
  app
    .get('/', (req, res) => {
      res.send('Good Morning Dear Sir !');
    })
    .post('/gimme', (req, res) => {
      request.get({
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'ThoroughWebEntertainmentBoard',
        },
        url: `https://api.github.com/users/${req.query.username}`,
      }, (error, response, body) => {
        if (error) {
          res.send(`error: ${error}`);
        } else if (response.statusCode !== 200) {
          res.send(`status: ${request.statusCode}`);
        } else {
          res.send(body);
        }
      });
    })
    // .use(express.static(path.join(__dirname, 'public')))
    // .set('views', path.join(__dirname, 'views'))
    // .set('view engine', 'ejs')
    // .get('/', (req, res) => res.render('pages/index'))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
}

function fetchUser(context) {
  console.log('getting user informations');
  return new Promise((resolve, reject) => {
    getUser((error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });
}

function fetchData() {
  console.log('getting data');
  const context = {};

  return fetchUser(context);
}

fetchData()
  .then((result) => {
    console.log('sucess!');
    console.log(result);
  })
  .catch((error) => {
    console.log('failure!');
    console.log(error);
  });
