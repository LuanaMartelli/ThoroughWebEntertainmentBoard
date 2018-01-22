##Stats du perso :

PV
ATTAQUE 
DEFENSE
VITESSE 
CHARISME
INTELLIGENCE

##Données utilisées :

- Nombre de commits 
- Nombre d'issues ouvertes
- Nombre de repos
- Nombre followers

À chaque objectif atteint, on reçoit un certain nombre de points d'expériences. À chaque augmentation de niveau on obtient des points à distribuer parmi nos stats. 

##Objectifs :

- 1 xp par commit
- 15 xp par issue ouverte
- 50 xp par repos
- 20 xp par follower

##Calcul des niveaux :
niveau = `round(0.3 * sqrt(xp))`


var total_xp = data['commits'] + 15 * data['issues'] + 50 * data['repos'] + 20 * data['followers']
var total_level = round(0.3 * sqrt(total_xp))
var total_pv = data['commits']
var total_attack = 1/3 * data['commits'] + data['issues'] * 5
var total_def = data['repos'] * 15
var total_speed = data['followers'] * 10 
var total_charisma = data['followers'] * 5  + data['fork'] * 5
var total_intel = data['following'] * 5

var hero = {
	'xp':total_xp,
	'level':total_level,
	'pv':total_pv,
	'attack':total_attack,
	'defense':total_def,
	'speed':total_speed,
	'charisma':total_charisma,
	'intel':total_intel
};
