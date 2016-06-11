/****** Configuration ajustable ******/

/* Durée maximmum d'une partie en seconde */
var stopTime = 60;

/* Score requis pour gagner la partie */
var scoreRequired = 100;

/* Taille en largeur de l'écran en pixel */
var gameWidth = 1536;

/* Taille en hauteur de l'écran en pixel */
var gameHeight = 2048;

/* Gain de score par bon objet (Sprite à définir en fonction) */
var scoreNumber = 5;

/* Arrêter le jeu si le joueur atteins le score requis */
var stopGameWithScore = true;

/* Vitesse du jeu (temps en seconde entre chaque objet) */
var gameSpeed = 0.7;

/* Activer ou non la musique */
var enableMusic = false;

/* Volume de la musique, entre 0 et 1 (exemple : 0.5) */
var musicVolume = 1;

/* Fonction appelée lors de la victoire */
function win(score) {
    backToMenu();
}

/* Fonction appelée lors de la défaite */
function lose(score) {
    backToMenu();
}

/******* Jeu (Ne pas modifier) *******/

game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS, 'gameDiv', { preload: preload, create: create, update: preupdate });
game.transparent = true;

var score = 0;
var scoreText, ordures, recycles, spawnEvent, endGameEvent,
	backgroundMusic, spritePlus, spriteMoins, timer, timeEvent, backgroundSprite;


var piece, inFadeAction, readyToStart = false;

var tools = {};

tools.rand = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

tools.setColor = function (value) {
    value = value / 100;
    var c = ((1 - value) * 120).toString(10);
    return ["hsl(", c, ", 90%, 50%)"].join("");
};

function preupdate() {

	if (readyToStart) {
		game.paused = false;
		update();
	} else {
		game.paused = true;
		conteneur.visible = false;
		backgroundSprite.visible = false;
	}
}

function startGame() {
	$('.mainImg').hide();
    $('#creditLink').hide();

	try {
		endText.destroy();
	} catch (err) {}

	spawnEvent.pause = false;
    game.paused = false;

    conteneur.visible = true;
	backgroundSprite.visible = true;
	if (enableMusic){
		backgroundMusic.volume = enableMusic ? musicVolume : 0;
		backgroundMusic.play();
	}

	timer = 0;
	score = 0;
	scoreText.text = 'score : ' + score;
	readyToStart = true;
}

function preload() {

    /*************************** GAME SCALE ****************************/
   	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    /*----------------------------- Audio ---------------------------*/
    if (enableMusic) {
    	game.load.audio('music-ambient', 'param/audio/bensound-energy.mp3');
    }

    /***************************** SPRITES *****************************/
	  game.load.image('background', 'param/img/background/background.png');
    game.load.image('conteneur', 'param/img/conteneur.png');
    game.load.image('scoreP', 'param/img/plus5.png');
    game.load.image('scoreM', 'param/img/moins5.png');

    /*----------------------------- Ordures ---------------------------*/
    game.load.image('garbage-1', 'param/img/ordure/banane.png');
    game.load.image('garbage-2', 'param/img/ordure/batterie.png');
    game.load.image('garbage-3', 'param/img/ordure/burger.png');
    game.load.image('garbage-4', 'param/img/ordure/fer.png');
    game.load.image('garbage-5', 'param/img/ordure/pot.png');

    /*--------------------------- Recyclables -------------------------*/
    game.load.image('recycle-1', 'param/img/recycle/bouteilleEau.png');
    game.load.image('recycle-2', 'param/img/recycle/canette.png');
    game.load.image('recycle-3', 'param/img/recycle/carton.png');
    game.load.image('recycle-4', 'param/img/recycle/journal.png');
    game.load.image('recycle-5', 'param/img/recycle/lessive.png');

    /*--------------------------- Font ------------------------------*/
    game.load.bitmapFont('scoreFont', 'param/img/font/font.png', 'param/img/font/font.xml');
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
   	game.physics.arcade.gravity.y = 200;

    backgroundSprite = game.add.sprite(0, 0, 'background');
    conteneur = game.add.sprite(0, 0, 'conteneur');
    conteneur.x = (game.width / 2) - (conteneur.width / 2);
    conteneur.y = game.height - conteneur.height;

    scoreText = game.add.bitmapText(game.width - 280, 20, 'scoreFont', 'score : 0', 50);
    scoreText.visible = true;

    ordures = game.add.group();
    recycles = game.add.group();

  	// Nombre d'image bonne et mauvaise
  	ordures.nbMateria = 5;
  	recycles.nbMateria = 5;

  	// Nom des préfixe d'image
  	ordures.prefixName = "garbage";
  	recycles.prefixName = "recycle";

    // Bonne entité ?
    ordures.isGood = false;
    recycles.isGood = true;


    // PHYSICS //
    game.physics.arcade.enable(ordures);
    game.physics.arcade.enable(recycles);
    game.time.events.events = [];
    spawnEvent = game.time.events.loop(Phaser.Timer.SECOND * gameSpeed, randomSpawn, this);
    timeEvent =  game.time.events.loop(1000, function() { timer++; }, this);

    // AUDIO //
    if (enableMusic){
    	backgroundMusic = game.add.audio('music-ambient');
    }

}

function update() {
	updatePositionsGroups(ordures);
    updatePositionsGroups(recycles);
    updateProgressBar();

}

function updateProgressBar() {
	percent = timer / stopTime * 100;
	$('.progress').css('width', 100 - percent + '%');
	$('.progress-bar').css('background-color', tools.setColor(percent) );

	if (enableMusic && percent >= 90 && backgroundMusic.volume > 0){
		backgroundMusic.volume -= 0.01;
		inFadeAction = true;
	}
	if (stopGameWithScore && score >= scoreRequired){
		$('.progress').css('width', '0%');
		endGame();
	}
	if (percent >= 100){
		endGame();
	}
}


function eliminate (e) {
	if (e.isGood) {
		score += scoreNumber;
		spritePlus = game.add.sprite( game.width - (game.width / 4), game.height - conteneur.height, 'scoreP');
		game.physics.arcade.enable(spritePlus);
		spritePlus.checkWorldBounds = true;
		spritePlus.events.onOutOfBounds.add( function(el){ el.destroy(); }, this );
		spritePlus.body.gravity.y = 500;
	} else {
		if (score > 0) {
			score -= scoreNumber;
		}
		spriteMoins = game.add.sprite( (game.width / 4) - (game.width / 5), game.height - conteneur.height, 'scoreM');
		game.physics.arcade.enable(spriteMoins);
		spriteMoins.checkWorldBounds = true;
		spriteMoins.events.onOutOfBounds.add( function(el){ el.destroy(); }, this );
		spriteMoins.body.gravity.y = 500;
	}
	scoreText.text = 'score : ' + score;
    e.destroy();
}

function randomSpawn() {
	randomCreate(tools.rand(0,1) ? ordures : recycles );
}

function randomCreate(group, nb) {
	if (isNaN(nb) || nb == 0){
		nb = 1;
	}
	for (var i = 0; i < nb; i++){
			item = group.create((piece ? 0 : game.width), tools.rand(0, game.height / 2.8), group.prefixName + '-' + tools.rand(1, group.nbMateria));
			game.physics.arcade.enable(item);
			item.isGood = group.isGood;
			item.isDrag, item.stopedDrag = false;
			item.inputEnabled = true;
	    item.input.enableDrag();
	    item.events.onDragStart.add(onDragStart, this);
	    item.events.onDragStop.add(onDragStop, this);
	    item.anchor.setTo(0.5,0.5);
			piece = piece ? false : true;
	}
}

function onDragStart(sprite, pointer) {
    sprite.isDrag = true;
    sprite.body.moves = false;
}

function onDragStop(sprite, pointer) {
    sprite.stopedDrag = true;
}

function updatePositionsGroups(group) {
	group.forEach(function(elem) {
		if (!elem.isDrag){

			if (!(elem.y < (game.height - conteneur.height))){
				eliminate(elem);
			}

			spritePos = elem.x;
			if (spritePos >= 0 && spritePos <= (game.width / 12)*1 ) {
            	elem.x += 6;
	        } else if (spritePos >= (game.width / 12)*1 && spritePos <= (game.width / 12)*2 ) {
	            elem.x += 5;
	        } else if (spritePos >= (game.width / 12)*2 && spritePos <= (game.width / 12)*3 ) {
	            elem.x += 4;
	        } else if (spritePos >= (game.width / 12)*3 && spritePos <= (game.width / 12)*4 ) {
	            elem.x += 3;
	        } else if (spritePos >= (game.width / 12)*4 && spritePos <= (game.width / 12)*5 ) {
	            elem.x += 2;
	        } else if (spritePos >= (game.width / 12)*5 && spritePos <= (game.width / 12)*6 ) {
	            elem.x += 1;
	        } else if (spritePos >= (game.width / 12)*6 && spritePos <= (game.width / 12)*7 ) {
	            elem.x -= 1;
	        } else if (spritePos >= (game.width / 12)*7 && spritePos <= (game.width / 12)*8 ) {
	            elem.x -= 2;
	        } else if (spritePos >= (game.width / 12)*8 && spritePos <= (game.width / 12)*9 ) {
	            elem.x -= 3;
	        } else if (spritePos >= (game.width / 12)*9 && spritePos <= (game.width / 12)*10 ) {
	            elem.x -= 4;
	        } else if (spritePos >= (game.width / 12)*10 && spritePos <= (game.width / 12)*11 ) {
	            elem.x -= 5;
	        } else if (spritePos >= (game.width / 12)*11 && spritePos <= (game.width / 12)*12 ) {
	            elem.x -= 6;
	        } else if (spritePos == game.width / 2 ) {
                elem.x += 0;
	        }else {
	        	elem.x -= 6;
	        }

	        elem.rotation = game.physics.arcade.angleToXY(elem, game.width / 2, (game.height - conteneur.height));

		} else {
			if (elem.stopedDrag) {
				if (elem.x < game.width / 2) {
					elem.x -= 15;
					elem.angle -= 5;
				} else {
					elem.x += 15;
					elem.angle += 5;
				}
				if (elem.x < 0 || elem.x > game.width) {
					elem.destroy();
				}
			}
		}
	});

}

function endGame() {
	  endText = game.add.text(game.width/2 - 100, 400, 'Jeu terminé', { fontSize: '32px', fill: '#000' });
    endText.visible = true;
    spawnEvent.pause = true;

    if (stopGameProcess()) {
    	if (score >= scoreRequired) {
			win(score);
		} else {
			lose(score);
		}
    }

}

function stopGameProcess() {
	ordures.removeAll();
	recycles.removeAll();

	try {
		spriteMoins.destroy();
	} catch(err){}

	try {
		spritePlus.destroy();
	} catch(err){}

	if (enableMusic) {
		backgroundMusic.stop();
	}

	game.paused = true;
  readyToStart = false;

	return true;
}

function backToMenu() {
	$('.mainImg').show();
	$('#creditLink').show();
}
