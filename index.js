const { token } = require('userToken.json');
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
  .get('/repos', (req, res) => {
    const reposResult = [];
    fetchGithub(`https://api.github.com/users/${req.query.username}`)
      .then(user => fetchGithub(user.repos_url))
      .then((repos) => {
        for (let i = 0; i < repos.length; i += 1) {
          reposResult.push({
            id: repos[i].id,
            name: repos[i].name,
            description: repos[i].description,
            url: repos[i].html_url,
          });
        }

        res.send(reposResult);
      }).catch((error) => {
        res.send(error);
      });
  }).get('/hero', (req, res) => {
    const context = {};
    let issuesPromise;
    fetchGithub(`https://api.github.com/users/${req.query.username}`)
      .then((user) => {
        context.userID = user.id;
        context.username = user.login;
        context.name = user.name;
        context.avatar = user.avatar_url;
        context.nbrFollowers = user.followers;
        context.nbrFollowing = user.following;
        return fetchGithub(`https://api.github.com/repos/${req.query.username}/${req.query.repo}`);
      })
      .then((repo) => {
        context.repoName = repo.name;
        context.nbrForks = repo.forks_count;

        // res.send(context);
        // Saving the issues promise for future use
        const number = '{/number}';
        const issuesUrl = repo.issues_url.substring(
          0,
          repo.issues_url.length - number.length
        );
        issuesPromise = fetchGithub(issuesUrl);

        // Creating the url for accessing the list of commits
        const sha = '{/sha}';
        const commitsUrl = repo.commits_url.substring(
          0,
          repo.commits_url.length - sha.length
        );

        return fetchGithub(commitsUrl);
      })
      .then((commits) => {
        context.nbrCommits = commits.length;
        return issuesPromise;
      })
      .then((issues) => {
        context.nbrIssues = issues.length;

        res.send(context);
      })
      .catch((error) => {
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
