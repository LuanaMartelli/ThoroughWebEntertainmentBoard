function logBase(val, base) {
  return Math.log(val) / Math.log(base);
}

function calculateStat(root, value) {
  const flooredStep = Math.floor(logBase(value, root));

  return {
    value,
    achieved: root ** flooredStep,
    missing: (root ** (flooredStep + 1)) - value,
    next: root ** (flooredStep + 1),
  };
}

function addAchievement(name, stat) {
  let Message = '';
  if (stat.achieved === 1) {
    Message += `You must reach <strong>${stat.next}</strong> ${name} to get this achievement. Only <strong>${stat.missing}</strong> more!`;
  } else {
    Message += `You got to <strong>${stat.achieved}</strong> ${name} (you have ${stat.value})! <strong>${stat.missing}</strong> left until the next (${stat.next}).`;
  }
  document.getElementById(`${name}Achievements`).innerHTML = Message;
}

function setAchievements(hero) {
  addAchievement('commits', calculateStat(10, hero.commits));
  addAchievement('followers', calculateStat(5, hero.followers));
  addAchievement('repositories', calculateStat(2, hero.repositories));
}
