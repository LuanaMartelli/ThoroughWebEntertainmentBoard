// Ici faire l'appel ajax jquery au gimme
/* global $ graphUser setAchievements */

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
    .done((hero) => {

      let sumStats = hero.stats.hp + hero.stats.attack
        + hero.stats.defense + hero.stats.speed
        + hero.stats.charisma + hero.stats.intel;

      graphUser([
        { name: 'HP', value: hero.stats.hp / sumStats },
        { name: 'ATTACK', value: hero.stats.attack / sumStats },
        { name: 'DEFENSE', value: hero.stats.defense / sumStats },
        { name: 'SPEED', value: hero.stats.speed / sumStats },
        { name: 'CHARISMA', value: hero.stats.charisma / sumStats },
        { name: 'INTELLIGENCE', value: hero.stats.intel / sumStats },
      ]);


      setAchievements({
        commits: hero.achievments.commits,
        followers: hero.achievments.followers,
        repositories: hero.achievments.repos,
      });

      $('#level').html(hero.stats.level);
      $('#attack').html(hero.stats.attack);
      $('#xp').html(hero.stats.xp);
      $('#defense').html(hero.stats.defense);
      $('#hp').html(hero.stats.hp);
      $('#speed').html(hero.stats.speed);
      $('#intel').html(hero.stats.intel);
      $('#charisma').html(hero.stats.level);
    });
}

