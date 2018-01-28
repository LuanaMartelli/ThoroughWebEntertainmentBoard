# ThoroughWebEntertainmentBoard
Third TWEB Project

## Context
This is a project done in the TWEB course and is the third part of the application called Gamification. The objective is to give the user important data in a fun way, like a game or in a fun display, so that the use of such data is easier and less boring.
In our project, we use the github data of the users, and we transpose it to a RPG character with stats corresponding with the data we found about him.

A simple single-app website on github pages allow a user to type any github username. A request is then sent to a server agent that retrieves all the data we need from github, using the github API V4 with a graphql query. The data is then processed to get all the information in a json format we can use on the webpage.

Finally, the data is displayed in a fun way with some stats and a graph to have a visual representation of a github user through it's work.

## Data
The data we get from the user are the following :
   - Number of commits
   - Number of open and/or closed issues
   - Number of repositories
   - Number of followers and following
   - Number of forks

Each of those stats give global experience, by different rates (a commit is worth less experience than a repository for instance).
Then, the level is calculated using a formula and displayed along a list of statistics : 
   - HP
   - Attack
   - Defense
   - Speed
   - Charisma
   - Intelligence
   
The data we collected can influence thoses stats with different ratios. The stats are also visible in a d3 radial graph by relatives values.

## Heroku 
https://quiet-depths-67700.herokuapp.com/

## local use
This project is in an npm package. To run it locally, you have to install the modules with `npm install`

## Token Github
The agent needs an OAuth token from github to be used efficiently. A file *userToken.json* must exist in the same folder as the agent with the following format :
```
{
   "token" : "convenientlyReadableTokenForAnExample"
}
```
