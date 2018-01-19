// Ici faire l'appel ajax jquery au gimme

function fetchRepos() {
  $.get( "https://quiet-depths-67700.herokuapp.com/hero", { username } )
      .done(function( data ) {
        alert( "Data Loaded: " + data );
      })
}

function fetchHero(repo) {
    let username = $('#inputPassword').val();

    $.get( "https://quiet-depths-67700.herokuapp.com/hero", { username } )
      .done(function( data ) {
        alert( "Data Loaded: " + data );
      })

    let hero = {
      'xp':10000,
      'level':5,
      'pv':100,
      'attack':10,
      'defense':10,
      'speed':2,
      'charisma':5,
      'intel':3
    };
}

