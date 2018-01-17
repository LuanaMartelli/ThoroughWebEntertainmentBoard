const express = require('express');
const rp = require('request-promise');

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
        context.userID = user.id;
        context.username = user.login;
        context.name = user.name;
        context.avatar = user.avatar_url;
        context.nbrFollowers = user.followers;
        context.nbrFollowing = user.following;
        return fetchGithub(user.repos_url);
      })
      .then((repos) => {
        context.nbrRepo = repos.length;
        res.send(context);
      }).catch((error) => {
        console.log('error:');
        console.log(error);
        res.send(error);
      });
  })
  // .use(express.static(path.join(__dirname, 'public')))
  // .set('views', path.join(__dirname, 'views'))
  // .set('view engine', 'ejs')
  // .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
