// Ici faire l'appel ajax jquery au gimme
/* global $ */

function fetchRepos() {
  const username = $('#inputPassword').val();
  $.get('https://quiet-depths-67700.herokuapp.com/repos', { username })
    .done((data) => {
      alert(`Data Loaded: ${data}`);
    });
}

function fetchHero(repo) {
  const username = $('#inputPassword').val();

  $.get('https://quiet-depths-67700.herokuapp.com/hero', { username })
    .done((data) => {
      alert(`Data Loaded: ${data}`);
    });

  const hero = {
    xp: 10000,
    level: 5,
    pv: 100,
    attack: 10,
    defense: 10,
    speed: 2,
    charisma: 5,
    intel: 3,
  };
}

