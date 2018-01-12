const express = require('express');
const request = require('request');

const PORT = process.env.PORT || 5000;

const app = express();

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
        let result = {
          username: body.login,
          avatar: body.avatar_url,
        };

        /*
        TODO faire toutes les requête nécaissaires pour obtenir toutes les infos désirées
        et les renvoyer dans un gros JSON qui contient tout ce dont on a besoin.

        Faire avec des promesses serait bien
        */
        res.send(body);
      }
    });
  })
  // .use(express.static(path.join(__dirname, 'public')))
  // .set('views', path.join(__dirname, 'views'))
  // .set('view engine', 'ejs')
  // .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
