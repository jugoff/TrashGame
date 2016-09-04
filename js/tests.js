var useTest = true; // Switch to on to enable Test.

function testRand(){
  var min = 0;
  var max = 10;

  var rand = tools.rand(min,max);
  if (rand >= min || rand <= max)  return true;
  else return false;
}

function testSetColor(){
  var color = tools.setColor(1);
  if (color.indexOf('hsl') == 0) return true;
  else return false;
}

function testGame(){
  if (game.id || !isNaN(game.id)) return true;
  else return false;
}

function testStartGame(){
  startGame();
  var imgMain = $('.mainImg');
  var asError = false;

  if (readyToStart == false){
    console.log("Test StartGame Fail : not readyToStart");
    asError = true;
  }

  if ( $(imgMain).is(":visible") ){
    console.log("Test StartGame Fail : imgMain is visible");
    asError = true;
  }

  if (game.paused != false){
    console.log("Test StartGame Fail : Game is paused");
    asError = true;
  }

  if (conteneur.visible != true){
    console.log("Test StartGame Fail : Conteneur is not visible");
    asError = true;
  }

  return asError;

}

function testStopGame(){
  endGame();
  var imgMain = $('.mainImg');
  var asError = false;
  if (game.paused != true){
    console.log("Test StartGame Fail : Game is not paused");
    asError = true;
  }

  if ( !$(imgMain).is(":visible") ){
    console.log("Test StartGame Fail : imgMain is not visible");
    asError = true;
  }

  return asError;

}

function testProcess(){
  var asError = false;
  if (!testRand()){
    console.log("Test testRand Fail");
    asError = true;
  }
  if (!testSetColor()){
    console.log("Test SetColor Fail");
    asError = true;
  }

  if (!testGame()){
    console.log("Test Game Fail");
    asError = true;
  }

  if (testStartGame()){
    console.log("Test StartGame Fail");
    asError = true;
  }

  if (testStopGame()){
    console.log("Test EndGame Fail");
    asError = true;
  }

  if (asError){
    console.log("Tests Fails !!");
  }else {
    console.log("All tests as been exectued with success !");
  }

}

function launchTests(){
  $('document').ready(function(){
    testProcess();
  });
}
