// Ici faire l'appel ajax jquery au gimme
/* global $ */

function fetchRepos() {
  const username = $('#inputUsername').val();
  $.get('https://quiet-depths-67700.herokuapp.com/repos', { username })
    .done((data) => {
      let options = '';
      data.forEach((element) => {
        options += `<button class="dropdown-item" type="button" onclick="fetchHero('${element.name}');">${element.name}</button>`;
      });

      $('#selectRepo')
        .find('button')
        .remove()
        .end()
        .append(options);
    });
}

function fetchHero(repo) {
  const username = $('#inputUsername').val();

  $.get('https://quiet-depths-67700.herokuapp.com/hero', { username, repo })
    .done((data) => {
      
    });
}

