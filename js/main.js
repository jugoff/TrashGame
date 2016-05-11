var game = new Phaser.Game($(document).width(), $(document).height(), Phaser.CANVAS, 'gameDiv', { preload: preload, create: create, update: update }); // Objet jeu de type Phaser & dimensions iPad

game.transparent = true;

var score = 0;
var scoreText, ordures, recycles, spritePos, conteneur;
var gameSpeed = 2; // time before item spawn


var tools = {}; // Namespace tools for personnals (non game) functions

tools.rand = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function preload() {

  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
  scoreText.anchor.setTo(0.5, 0.5);
  scoreText.visible = true;

  /*************************** GAME SCALE ****************************/
 	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  //game.scale.setScreenSize();
  /***************************** SPRITES *****************************/

	game.load.image('background', 'param/img/background/background.jpg');

  game.load.image('conteneur', 'param/img/conteneur.png');

	game.load.image('garbage-1', 'param/img/ordure/ampoule.png');
	game.load.image('garbage-2', 'param/img/ordure/banane.png');
	game.load.image('garbage-3', 'param/img/ordure/batterie.png');
	game.load.image('garbage-4', 'param/img/ordure/bouteille.png');
	game.load.image('garbage-5', 'param/img/ordure/burger.png');
	game.load.image('garbage-6', 'param/img/ordure/fer_repasser.png');
	game.load.image('garbage-7', 'param/img/ordure/pile.png');
	game.load.image('garbage-8', 'param/img/ordure/porcelaine.png');
	game.load.image('garbage-9', 'param/img/ordure/pot_fleur.png');
	game.load.image('garbage-10', 'param/img/ordure/sac.png');
	game.load.image('garbage-11', 'param/img/ordure/tv.png');



 	game.load.image('recycle-1', 'param/img/recycle/boiteOeufs.png');
  game.load.image('recycle-2', 'param/img/recycle/canette.png');
  game.load.image('recycle-3', 'param/img/recycle/carton.png');


}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
   	game.physics.arcade.gravity.y = 200;

    game.add.sprite(0, 0, 'background');
    conteneur = game.add.sprite(0 , 0, 'conteneur');
    conteneur.x = (game.width / 2) - (conteneur.width / 2);
    conteneur.y = game.height - conteneur.height;


    ordures = game.add.group();
    recycles = game.add.group();

  	// Nombre d'image bonne et mauvaise
  	ordures.nbMateria = 3;
  	recycles.nbMateria = 11;
  	// Nom des préfixe d'image
  	ordures.prefixName = "garbage";
  	recycles.prefixName = "recycle";
    // Bonne entité ?
    ordures.isGood = false;
    recycles.isGood = true;


    // PHYSICS //
    game.physics.arcade.enable(ordures);
    game.physics.arcade.enable(recycles);

    game.time.events.loop(Phaser.Timer.SECOND * gameSpeed, randomSpawn, this);

}

function update() {
    updatePositionsGroups(ordures);
    updatePositionsGroups(recycles);
    //game.physics.arcade.overlap(ordures, conteneur, collisionHandler, null, this);
    //game.physics.arcade.overlap(recycles, conteneur, collisionHandler, null, this);
    game.physics.arcade.collide(ordures, conteneur, collisionHandler, null, this);
    game.physics.arcade.collide(recycles, conteneur, collisionHandler, null, this);

}

function render() {

}

function collisionHandler (sprite, group) {
  console.log('sprite handler' + sprite);
  console.log('group handler' + group);
  if (true){
    score++;
  }else {
    score--;
  }
  eliminate(e1);
}

function eliminate (e) {
    e.destroy();
}

function randomSpawn(){
	randomCreate(tools.rand(0,1) ? ordures : recycles );
}

function randomCreate(group, nb){
	if (isNaN(nb) || nb == 0){
		nb = 1;
	}
	for (var i = 0; i < nb; i++){
			item = group.create(tools.rand(0, game.width), 0, group.prefixName + '-' + tools.rand(1, 3));
			game.physics.arcade.enable(item);
			item.events.onOutOfBounds.add( eliminate, this );
	}
}

function getKilledElement(group){
	returnSpr = null;
	console.log(group);
	group.forEachDead(function(spr) {
		returnSpr = spr;
	});
	return returnSpr;
}

function updatePositionsGroups(group){
	group.forEach(function(elem) {
		if (elem.alive){
			spritePos = ( elem.x + (elem.width / 2));
			if (spritePos >= 0 && spritePos <= (game.width / 12)*1) {
            	elem.x += 6;
	        } else if (spritePos >= (game.width / 12)*1 && spritePos <= (game.width / 12)*2) {
	            elem.x += 5;
	        } else if (spritePos >= (game.width / 12)*2 && spritePos <= (game.width / 12)*3) {
	            elem.x += 4;
	        } else if (spritePos >= (game.width / 12)*3 && spritePos <= (game.width / 12)*4) {
	            elem.x += 3;
	        } else if (spritePos >= (game.width / 12)*4 && spritePos <= (game.width / 12)*5) {
	            elem.x += 2;
	        } else if (spritePos >= (game.width / 12)*5 && spritePos <= (game.width / 12)*6) {
	            elem.x += 1;
	        } else if (spritePos >= (game.width / 12)*6 && spritePos <= (game.width / 12)*7) {
	            elem.x -= 1;
	        } else if (spritePos >= (game.width / 12)*7 && spritePos <= (game.width / 12)*8) {
	            elem.x -= 2;
	        } else if (spritePos >= (game.width / 12)*8 && spritePos <= (game.width / 12)*9) {
	            elem.x -= 3;
	        } else if (spritePos >= (game.width / 12)*9 && spritePos <= (game.width / 12)*10) {
	            elem.x -= 4;
	        } else if (spritePos >= (game.width / 12)*10 && spritePos <= (game.width / 12)*11) {
	            elem.x -= 5;
	        } else if (spritePos >= (game.width / 12)*11 && spritePos <= (game.width / 12)*12) {
	            elem.x -= 6;
	        }
		}
	});
}
