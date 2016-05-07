var game = new Phaser.Game(1536, 2048, Phaser.CANVAS, 'gameDiv', { preload: preload, create: create, update: update }); // Objet jeu de type Phaser & dimensions iPad

game.transparent = true;

var score = 0;
var scoreText, ordures, recycles;
var gameSpeed = 2; // time before item spawn


var tools = {}; // Namespace tools for personnals (non game) functions

tools.rand = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function preload() {
    
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    
    /*************************** GAME SCALE ****************************/
    /*
    game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
    game.stage.scale.setShowAll();
    window.addEventListener('resize', function () {
        game.stage.scale.refresh();
    });
    game.stage.scale.refresh();
    */
    /***************************** SPRITES *****************************/
    game.load.image('background', 'param/img/background/background.jpg');
    
	game.load.image('garbage-1', 'param/img/ordure/bouteille.png');
	game.load.image('garbage-2', 'param/img/ordure/burger.png');    
	game.load.image('garbage-3', 'param/img/ordure/fer_repasser.png');    

	game.load.image('recycle-1', 'param/img/recycle/boiteOeufs.png');    
    game.load.image('recycle-2', 'param/img/recycle/canette.png');    
    game.load.image('recycle-3', 'param/img/recycle/carton.png');

    
    
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
   	game.physics.arcade.gravity.y = 200;

    game.add.sprite(0, 0, 'background');
    

    ordures = game.add.group();
    recycles = game.add.group();
    
    // PHYSICS //
    game.physics.arcade.enable(ordures);
    game.physics.arcade.enable(recycles);    

    game.time.events.loop(Phaser.Timer.SECOND * gameSpeed, randomSpawn, this);

}

function update() {
    
}

function render() {
    
}

function eliminate (element) {
    //element.kill();
}

function randomSpawn(){
	if (tools.rand(1, 2) == 1){
		randomSpawnGarbage();
	}else {
		randomSpawnRecycle();
	}
}
        
function randomSpawnGarbage(nb){
	if (isNaN(nb) || nb == 0){
		nb = 1;
	}
	for (var i = 0; i < nb; i++){
		item = ordures.create(tools.rand(0, game.width), 0, 'garbage-' + tools.rand(1, 3));	
		game.physics.arcade.enable(item);
	}
	ordures.callAll('events.onInputDown.add', 'events.onInputDown', eliminate);
}

function randomSpawnRecycle(nb){
	if (isNaN(nb) || nb == 0){
		nb = 1;
	}
	for (var i = 0; i < nb; i++){
		item = recycles.create(tools.rand(0, game.width), 0, 'garbage-' + tools.rand(1, 3));	
		game.physics.arcade.enable(item);
		
	}
	ordures.callAll('events.onInputDown.add', 'events.onInputDown', eliminate);
}
