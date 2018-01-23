function stat(root, value) {
    let flooredStep = Math.flooredStep = Math.floor(logBase(value, root));

    return {
        "achieved" : Math.pow(root, flooredStep),
        "missing" : Math.pow(root, flooredStep + 1) - value,
        "next" : Math.pow(root, flooredStep + 1)
    };
}

function logBase(val, base) {
    return Math.log(val) / Math.log(base);
}

function addAchievement(name, stat){
    let Message = "";
    if(stat.achieved === 1){
        Message += `You must reach <strong>${stat.next}</strong> ${name} to get this achievement. Only <strong>${stat.missing}</strong> more!`
    }else{
        Message += `You have <strong>${stat.achieved}</strong> ${name}! <strong>${stat.missing}</strong> left until the next(${stat.next}).`
    }
    document.getElementById(`${name}Achievements`).innerHTML = Message;
}

function setAchievements(hero){
    addAchievement("commits", stat(10, hero.commits));
    addAchievement("followers", stat(5, hero.followers));
    addAchievement("repositories", stat(2, hero.repositories));
}

setAchievements({
    "commits" : 8754,
    "followers" : 78,
    "repositories" : 1
});