// import { userInfo } from 'os';

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

function createHero(data) {
  const achievments = {
    commits: data.user.repository.ref.target.history.totalCount,
    issues: data.user.repository.issues.totalCount,
    repos: data.user.repositories.totalCount,
    followers: data.user.followers.totalCount,
    following: data.user.following.totalCount,
    forks: data.user.repository.forkCount,
  };
  const userInfos = {
    id: data.user.id,
    username: data.user.login,
    name: data.user.name,
    url: data.user.url,
    avatar: data.user.avatarUrl,
    repo: data.user.repository.name,
  };

  const commitWeight = 1;
  const issueWeight = 15;
  const repoWeight = 50;
  const followerWeight = 20;

  const totalXP =
        (achievments.commits * commitWeight) +
        (achievments.issues * issueWeight) +
        (achievments.repos * repoWeight) +
        (achievments.followers * followerWeight);
  const totalLevel = Math.round(0.3 - Math.sqrt(totalXP));
  const totalHP = achievments.commits;
  const totalAttack = Math.round(((1 / 3) * achievments.commits) + (achievments.issues * 5));
  const totalDefense = achievments.repos * 15;
  const totalSpeed = achievments.followers * 10;
  const totalCharisma = (achievments.followers * 5) + (achievments.forks * 5);
  const totalIntel = achievments.following;

  const stats = {
    xp: totalXP,
    level: totalLevel,
    hp: totalHP,
    attack: totalAttack,
    defense: totalDefense,
    speed: totalSpeed,
    charisma: totalCharisma,
    intel: totalIntel,
  };

  return {
    stats,
    achievments,
    userInfos,
  };
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
          totalCount
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
    const variables = `{
      "username": "${req.query.username}",
      "repo": "${req.query.repo}"
    }`;

    const query = `query($username: String!, $repo: String!) {
      user(login: $username) {
        id
        login
        name
        url
        avatarUrl
        repositories {
          totalCount
        }
        followers {
          totalCount
        }
        following {
          totalCount
        }
        repository(name: $repo) {
          name
          forkCount
          issues {
            totalCount
          }
          ref(qualifiedName: "master") {
            target {
              ... on Commit {
                history {
                  totalCount
                }
              }
            }
          }
        }
      }
    }`;

    graphqlClient.request(query, variables)
      .then((response) => {
        const hero = createHero(response);
        res.send(hero);
      })
      .catch((error) => {
        res.send(error);
      });
  })
  // .use(express.static(path.join(__dirname, 'public')))
  // .set('views', path.join(__dirname, 'views'))
  // .set('view engine', 'ejs')
  // .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
