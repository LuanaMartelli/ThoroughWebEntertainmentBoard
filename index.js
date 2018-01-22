const express = require('express');
const rp = require('request-promise');
const path = require('path');
const PORT = process.env.PORT || 5000;

const app = express();

function fetchGithub(url) {
  return rp({
    headers: {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'ThoroughWebEntertainmentBoard',
    },
    url,
    json: true,
  });
}

app
  .get('/', (req, res) => {
    res.send('Good Morning Dear Sir !');
  })
  .post('/gimme', (req, res) => {
    const context = {};
    fetchGithub(`https://api.github.com/users/${req.query.username}`)
      .then((user) => {
        context.username = user.login;
        return fetchGithub(user.repos_url);
      })
      .then((repos) => {
        context.repo = repos[0].full_name;
        res.send(context);
      }).catch((error) => {
        console.log('error:');
        console.log(error);
        res.send(error);
      });
  })
  .use(express.static(path.join(__dirname, 'public')))
  // .set('views', path.join(__dirname, 'views'))
  // .set('view engine', 'ejs')
  // .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));