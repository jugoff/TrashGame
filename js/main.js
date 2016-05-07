var game = new Phaser.Game(1536, 2048, Phaser.CANVAS, 'gameDiv', { preload: preload, create: create, update: update }); // Objet jeu de type Phaser & dimensions iPad

game.transparent = true;

var score = 0;
var scoreText, ordures, recycles;
var gameState = {};                                                              // variable etat du jeu
var isOn = false;

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
    game.load.image('ampoule', 'param/img/ampoule.png');
    game.load.image('ampOn', 'param/img/ampOn.png');
    game.load.image('ampOff', 'param/img/ampOff.png');
    
    
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

    amp = ordures.create(tools.rand(50, game.width - 50), 0, 'ampOff');
    //amp.scale.setTo(0.5,0.5);
    game.physics.enable(amp, Phaser.Physics.ARCADE);
    amp.body.enable = true;
    amp.body.bounce.x = 1;
    amp.body.bounce.y = 1;
    amp.body.collideWorldBounds = true;

    amp.inputEnabled = true;
    amp.events.onInputDown.add(toggleLamp, this);

}

function update() {
    //amp.angle += tools.rand(2, 10);
}

function render() {
    
}

function eliminate (element) {

    // Removes the star from the screen
    element.kill();
}
        
function toggleLamp(){
	if (isOn){
		amp.loadTexture('ampOff', 0);
		isOn = false;
	}else {
		amp.loadTexture('ampOn', 0);
		isOn = true;
	}
	
}