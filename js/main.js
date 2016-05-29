
var stopTime = 60;
var scoreRequired = 30;
var gameWidth = 1536;
var gameHeight = 2048;
var scoreNumber = 5;
var game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS, 'gameDiv', { preload: initGame }); // Objet jeu de type Phaser & dimensions iPad


game.transparent = true;

var score = 0;
var scoreText, ordures, recycles, spawnEvent, endGameEvent, 
	backgroundMusic, spritePlus, spriteMoins, timer, timeEvent;

var gameSpeed = 0.6; // time before item spawn
var piece, inFadeAction, readyToStart = false;




var tools = {}; // Namespace tools for personnals (non game) functions

tools.rand = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

tools.setColor = function(value) {
    value = value / 100;
    var c = ( (1 - value ) * 120 ).toString(10);
    return ["hsl(",c,",90%,50%)"].join("");
}

function initGame(){
	// Menu before game start
	
	readyToStart = false;
	if (readyToStart){
		startGame();
	}
}

function startGame(){
	$('canvas').first().remove();
	$('.mainImg').hide();
	timer = 0;
	delete game;
	game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS, 'gameDiv', { preload: preload, create: create, update: update }); 
	game.transparent = true;

}

function preload() {
    
    /*************************** GAME SCALE ****************************/
   	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //game.scale.setScreenSize();
    
     /*----------------------------- Audio ---------------------------*/
    game.load.audio('music-ambient', 'param/audio/bensound-energy.mp3');
    
    /***************************** SPRITES *****************************/
	game.load.image('background', 'param/img/background/background.jpg');
    game.load.image('conteneur', 'param/img/conteneur.png');
    game.load.image('scoreP', 'param/img/plus5.png');
    game.load.image('scoreM', 'param/img/moins5.png');
    
    /*----------------------------- Ordures ---------------------------*/
	game.load.image('garbage-1', 'param/img/ordure/ampoule.png');
	game.load.image('garbage-2', 'param/img/ordure/banane.png');    
	game.load.image('garbage-3', 'param/img/ordure/batterie.png');    
	game.load.image('garbage-4', 'param/img/ordure/bouteilleVerre.png');    
	game.load.image('garbage-5', 'param/img/ordure/burger.png');    
	game.load.image('garbage-6', 'param/img/ordure/fer_repasser.png');    
	game.load.image('garbage-7', 'param/img/ordure/pile.png');    
	game.load.image('garbage-8', 'param/img/ordure/porcelaine.png');    
	game.load.image('garbage-9', 'param/img/ordure/pot_fleur.png');    
	game.load.image('garbage-10', 'param/img/ordure/sac.png');    
	game.load.image('garbage-11', 'param/img/ordure/tv.png');
    
    /*--------------------------- Recyclables -------------------------*/
 	game.load.image('recycle-1', 'param/img/recycle/boiteOeufs.png');    
 	game.load.image('recycle-2', 'param/img/recycle/bouteilleEau.png');    
    game.load.image('recycle-3', 'param/img/recycle/canette.png');    
    game.load.image('recycle-4', 'param/img/recycle/carton.png');
    game.load.image('recycle-5', 'param/img/recycle/conserve.png');
    game.load.image('recycle-6', 'param/img/recycle/journal.png');
    game.load.image('recycle-7', 'param/img/recycle/lessive.png');
    game.load.image('recycle-8', 'param/img/recycle/lettre.png');
    game.load.image('recycle-9', 'param/img/recycle/sirop.png');
    
    /*--------------------------- Font ------------------------------*/
   
   game.load.bitmapFont('scoreFont', 'param/img/font/font.png', 'param/img/font/font.xml');
}

function create() {
	
    game.physics.startSystem(Phaser.Physics.ARCADE);
   	game.physics.arcade.gravity.y = 200;

    game.add.sprite(0, 0, 'background');
    conteneur = game.add.sprite(0 , 0, 'conteneur');
    conteneur.x = (game.width / 2) - (conteneur.width / 2);
    conteneur.y = game.height - conteneur.height;
    
    scoreText = game.add.bitmapText(game.width - 220, 20, 'scoreFont', '0', 50);
    scoreText.visible = true;
	
    ordures = game.add.group();
    recycles = game.add.group();

  	// Nombre d'image bonne et mauvaise
  	ordures.nbMateria = 11;
  	recycles.nbMateria = 9;
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
    timeEvent =  game.time.events.loop(1000, function(){ timer++; }, this);

    // AUDIO //
    backgroundMusic = game.add.audio('music-ambient');
    backgroundMusic.play();

}

function update() {

	updatePositionsGroups(ordures);
    updatePositionsGroups(recycles);
    updateProgressBar();
	
}

function render() {
    
}

function updateProgressBar(){
	
	percent = timer / stopTime * 100;
	$('.progress').css('width', 100 - percent + '%');
	$('.progress-bar').css('background-color', tools.setColor(percent) );
	
	if (percent >= 90 && !inFadeAction){
		backgroundMusic.fadeOut(5000);
		inFadeAction = true;
	}

	if (percent >= 100){
		endGame();
	}

}


function eliminate (e) {

	if (e.isGood){
		score += scoreNumber;
		spritePlus = game.add.sprite( game.width - (game.width / 4), game.height - conteneur.height, 'scoreP');
		game.physics.arcade.enable(spritePlus);
		spritePlus.checkWorldBounds = true;
		spritePlus.events.onOutOfBounds.add( function(el){ el.destroy(); }, this );
		spritePlus.body.gravity.y = 500;

	}else {
		if (score > 0){
			score -= scoreNumber;
			spriteMoins = game.add.sprite( game.width / 4 - conteneur.width , game.height - conteneur.height, 'scoreM');			
			game.physics.arcade.enable(spriteMoins);
			spritePlus.checkWorldBounds = true;
			spriteMoins.events.onOutOfBounds.add( function(el){ el.destroy(); }, this );
			spriteMoins.body.gravity.y = 500;
		}
	}	
	scoreText.text = score;
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
			item = group.create((piece ? 0 : game.width), tools.rand(0, game.height / 2.8), group.prefixName + '-' + tools.rand(1, group.nbMateria));
			game.physics.arcade.enable(item);
			item.events.onOutOfBounds.add( eliminate, this );
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


function updatePositionsGroups(group){
	group.forEach(function(elem) {
		if (!elem.isDrag){

			
			if (!(elem.y < (game.height - conteneur.height))){
				eliminate(elem);
			}

			spritePos = ( elem.x + (elem.width / 2));
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
	       
		}else {
			if (elem.stopedDrag){
				if (elem.x < game.width / 2){
					elem.x -= 15;
					elem.angle -= 5;
				}else {
					elem.x += 15;
					elem.angle += 5;
				}
				if (elem.x < 0 || elem.x > game.width){
					elem.destroy();
				}
			}
		}
	});
	
} 

function endGame(){
	endText = game.add.text(game.width/2 - 100, 400, 'Jeu terminé', { fontSize: '32px', fill: '#000' });
    endText.visible = true;
    spawnEvent.pause = true;
	game.paused = true;
	backToMenu();
}

function backToMenu(){
	$('canvas').first().remove();
	$('.mainImg').show();
}
