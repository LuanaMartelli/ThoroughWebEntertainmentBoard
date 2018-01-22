const { token } = require('./userToken.json');
const express = require('express');
const graphql = require('graphql-request');

const PORT = process.env.PORT || 5000;

const app = express();

const graphqlClient = new graphql.GraphQLClient('https://api.github.com/graphql', {
  headers: {
    Authorization: `bearer ${token}`,
    'User-Agent': 'ThoroughWebEntertainmentBoard',
  },
});

function createRepos(data) {
  const repos = [];
  data.user.repositories.nodes.array.forEach(element => repos.push(element));
  return repos;
}

app
  .get('/', (req, res) => {
    const query = `query {
      repository(owner:"octocat", name:"Hello-World") {
        issues(last:20, states:CLOSED) {
          edges {
            node {
              title
              url
              labels(first:5) {
                edges {
                  node {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }`;

    graphqlClient.request(query, {})
      .then((response) => {
        res.send(response);
      }).catch((error) => {
        res.send(error);
      });
  })
  .get('/repos', (req, res) => {
    const variables = `{
      "username": "${req.query.username}"
    }`;

    const query = `query($username:String!) {
      user(login: $username) {
        repositories(first: 30) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            name
            description
            url
          }
        }
      }
    }`;

    graphqlClient.request(query, variables)
      .then((response) => {
        const repos = response.user.repositories.nodes;
        res.send(repos);
      })
      .catch((error) => {
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
