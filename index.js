// import { userInfo } from 'os';

const { token } = require('./userToken.json');
const express = require('express');
const graphql = require('graphql-request');
const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();

// Used to expose the main web page in heroku
app.use(express.static(path.join(__dirname, 'public')));

// Creating the graphQL client to make qraphQL calls on the github API
const graphqlClient = new graphql.GraphQLClient('https://api.github.com/graphql', {
  headers: {
    Authorization: `bearer ${token}`,
    'User-Agent': 'ThoroughWebEntertainmentBoard',
  },
});

// Creating a hero object with the data fetched from github
function createHero(data) {
  // Creating the sub-object with data used for achievments
  const achievments = {
    commits: data.user.repository.ref.target.history.totalCount,
    issues: data.user.repository.issues.totalCount,
    repos: data.user.repositories.totalCount,
    followers: data.user.followers.totalCount,
    following: data.user.following.totalCount,
    forks: data.user.repository.forkCount,
  };
  // Creating the sub-object with informations about the user
  const userInfos = {
    id: data.user.id,
    username: data.user.login,
    name: data.user.name,
    url: data.user.url,
    avatar: data.user.avatarUrl,
    repo: data.user.repository.name,
  };

  // Creating the sub-object representing the hero's stats
  const commitWeight = 1;
  const issueWeight = 15;
  const repoWeight = 50;
  const followerWeight = 20;

  const totalXP =
    (achievments.commits * commitWeight) +
    (achievments.issues * issueWeight) +
    (achievments.repos * repoWeight) +
    (achievments.followers * followerWeight);
  const totalLevel = Math.round(0.3 * Math.sqrt(totalXP));
  const totalHP = Math.round(((1 / 4) * achievments.commits));
  const totalAttack = Math.round(((1 / 8) * achievments.commits) + (achievments.issues * 5));
  const totalDefense = Math.round(((1 / 16) * achievments.commits)) + (achievments.repos * 1.25);
  const totalSpeed = Math.round(((1 / 8) * achievments.commits)) + (achievments.followers * 10);
  const totalCharisma = Math.round(((1 / 16) * achievments.commits)) + (achievments.followers * 5)
                          + (achievments.forks * 5);
  const totalIntel = Math.round(((1 / 8) * achievments.commits)) + (achievments.following * 5);

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

  // Creation of the hero
  return {
    stats,
    achievments,
    userInfos,
  };
}

app
  .get('/repos', (req, res) => {
    // /repos endpoint used to retrieve the user's repos

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
            owner {
              login
            }
          }
        }
      }
    }`;

    // We're interested in the user's repos where he's the owner
    graphqlClient.request(query, variables)
      .then((response) => {
        const temp = response.user.repositories.nodes;
        const repos = [];
        for (let i = 0; i < temp.length; i += 1) {
          if (temp[i].owner.login === req.query.username) {
            repos.push(temp[i]);
          }
        }

        // We send the list of repositories
        res.send(repos);
      })
      .catch((error) => {
        res.send(error);
      });
  }).get('/hero', (req, res) => {
    // /hero endpoint used to retrieve the hero built from the user's repo
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
