
//-------------------------------------------------------------------------------------------//
// VARIABLES --------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext('2d'),
	x = canvas.width / 2,
    y = canvas.height - 10,
	width = 600,
	height = 600,
	keyPress = [],
	enemies = [],
	rockets = [],
	moveJet = false,
	score = 0,
	pauseToggle = false,
	creditToggle = false,
	startGameToggle = false,
	bonusToggle = false,
	bonusHit = false,
	levels = [];


//-------------------------------------------------------------------------------------------//
// START GAME -------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

function startGame() {
	startGameToggle = true;
	canvas.removeEventListener("click", startGame, false);
}

//-------------------------------------------------------------------------------------------//
// CLEAR CANVAS -----------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

function clearCanvas(a) {
	a.clearRect(0, 0, canvas.width, canvas.height);
	// CANVAS DOES NOT RECOGNIZE FONTS AFTER REFRESH -  ctx.save(), ctx.restore() not working.
	ctx.font = "bold 14px Press_Start_2P";
}

//-------------------------------------------------------------------------------------------//
// RESET ------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

function reset() {
	var enemyxPos = 50;
	console.log("reset values: " + jet.yPos + " width: " + jet.width + " height: " + jet.height)	
 	jet.xPos = (width / 2) - 25, jet.yPos = height - 75, jet.width = 50, jet.height = 57;
	
	for (var i = 0; i < enemies.length; i++) {
 		enemies[i][0] = enemyxPos;
 		enemies[i][1] = -45;
 		enemyxPos = enemyxPos + enemy.width + 60;
	}
}

//-------------------------------------------------------------------------------------------//
// PAUSE ------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
 
 function pause() {
 	this.font = "bold 14px Press_Start_2P";
	this.color = "#fff";
	this.width = 490;
	this.height = 30;
	this.pauseText = "Game is paused. Press P to continue";
	this.leftPadding = 300;
	this.yPos = 30;
	this.pauseTextxPos = x;
 }
 
 pause.prototype.drawPause = function() {
	if(jet.inPlay) {
		ctx.font = this.font;
		ctx.fillStyle = this.color;
		ctx.textAlign = "center";
 		ctx.fillText(this.pauseText, this.pauseTextxPos, height / 2);
		// CONTINUE
		//canvas.addEventListener("click", continueClick, false);
	}
}

var pause = new pause();

function pauseGame() {
	if(jet.inPlay && startGameToggle && life.life > 0) {
		if (!pauseToggle) {
			pauseToggle = true;
			// CLEAR TIMEOUT OF LOOP
			clearTimeout(loopGame);
			pause.drawPause();
		} else if (pauseToggle) {
		   pauseToggle = false;
		   // SET TIMEOUT VARIABLE AGAIN
		   loopGame = setTimeout(gameLoop, 1000 / 30);
		}
	}
}

//-------------------------------------------------------------------------------------------//
// CONTINUE ---------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

function continueClick(e) {
	var cursorPos = getCursorPosition(e);
	if (cursorPos.x > (width / 2) - 53 && cursorPos.x < (width / 2) + 47 && cursorPos.y > (height / 2) + 10 && cursorPos.y < (height / 2) + 50) {
   		jet.inPlay = true;
		life.life = 3;
		reset();
		canvas.removeEventListener("click", continueClick, false);
	}
}

//-------------------------------------------------------------------------------------------//
// MOVE ELEMENT -----------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

function moveElement(t) {
	// t = this
	if(t.yPos > height) {
		t.yPos = -(height - 1);
	}
	if(t.yPosEnd > height) {
		t.yPosEnd = -(height - 1);
	}
	t.yPos += t.speed;
	t.yPosEnd += t.speed;
}

//-------------------------------------------------------------------------------------------//
// PLAY SOUND -------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

function playSound(a) {
	document.getElementById(a).currentTime = 0;
	document.getElementById(a).pause();
	document.getElementById(a).play();
}

function pauseSound(a) {
	document.getElementById(a).currentTime = 0;
	document.getElementById(a).pause();
}

//-------------------------------------------------------------------------------------------//
// BONUS POINTS -----------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

var bp = [];

function bonusPoints() {
 	this.img = new Image();
	this.img.src = "assets/bonus.png";
	this.pointValue = 100;
	this.xPos = 50;
	this.yPos = 45;
	this.width = 50;
	this.height = 50;
	this.speed = 5;
}

bonusPoints.prototype.addPoints = function() {
	//bp.push([this.xPos, this.yPos, this.width, this.height, this.speed]);
	bp.push([(Math.random() * 500) + 50, -45, this.width, this.height, this.speed]);
}

bonusPoints.prototype.drawBonusPoints = function() {
 	for (var i = 0; i < bp.length; i++) {
 		ctx.drawImage(this.img, bp[i][0], bp[i][1]);
	}
}

bonusPoints.prototype.moveBonusPoints = function() {
	// USER ONLY HAS ONCE CHANCE TO GET BONUS
	for (var i = 0; i < bp.length; i++) {
		if (bp[i][1] < height) {
		  bp[i][1] += bp[i][4];
		} else if (bp[i][1] > bp - 1) {
		  bp[i][1] = -45;
		}
 	}
	
}

var bonusPoints = new bonusPoints();

//-------------------------------------------------------------------------------------------//
// BONUS STRIKE -----------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

function bonusStrike() {
	for (var i = 0; i < rockets.length; i++) {
 			// CHECK IF ROCKET STRIKES BONUS
 			for(var j = 0; j < bp.length; j++) {
 				// BONUS STRIKE
 				// ROCKET X POSITION IS GREATER THAN BP X POSITION AND ROCKET X POSITION IS LESS THAN BP X POSITION PLUS IT'S WIDTH
 				if (rockets[i][1] <= (bp[j][1] + bp[j][3]) && rockets[i][0] >= bp[j][0] && rockets[i][0] <= (bp[j][0] + bp[j][2])) {
					// PLAY SOUND
					playSound("bonusSound");
 					bonusToggle = false;
					bonusHit = true; // SET SO BONUS IS REMOVED AFTER ONLY ONE STRIKE
					bp.splice(j, 1);
					score += bonusPoints.pointValue;
 				}
 			}
	}
}

//-------------------------------------------------------------------------------------------//
// CURSOR POSITION --------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

function getCursorPosition(e) {
	var x, y;
	if(e.pageX || e.pageY) {
		x = e.pageX;
		y = e.pageY;
	} else {
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrorllTop;
	}
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	var cursorPos = new cursorPosition(x, y);
	return cursorPos;
}

//-------------------------------------------------------------------------------------------//
// CURSOR POSITION --------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

function cursorPosition(x, y) {
	this.x = x;
	this.y = y;
}

//-------------------------------------------------------------------------------------------//
// CLOUDS -----------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

function clouds() {
	this.img = new Image();
	this.img.src = "assets/clouds2.png";
	this.xPos = 0;
	this.yPos = -100; // show off canvas first
	this.yPosEnd = -height; // canvas height
	this.speed = 5;
	this.count = 4;
}

clouds.prototype.drawClouds = function() {
	ctx.drawImage(clouds.img, clouds.xPos, clouds.yPos);
	ctx.drawImage(clouds.img, clouds.xPos, clouds.yPosEnd);
	var t = this;
	moveElement(t);
}

var clouds = new clouds();

//-------------------------------------------------------------------------------------------//
// BACKGROUND -------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

function background() {
	this.img = new Image();
	this.img.src = "assets/sea.png";
	this.xPos = 0;
	this.yPos = 0;
	this.yPosEnd = -height; // canvas height
	this.speed = 1;
}

background.prototype.drawBackground = function() {
	ctx.drawImage(background.img, background.xPos, background.yPos);
	ctx.drawImage(background.img, background.xPos, background.yPosEnd);
	var t = this;
	moveElement(t);
}

var background = new background();

//-------------------------------------------------------------------------------------------//
// JET --------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

function jet() {
	this.img = new Image();
	this.img.src = "assets/jet.png"; 
	this.xPos = (width / 2) - 25;
	this.yPos = height - 75;
	this.width = 50;
	this.height = 57;
	this.speed = 6;
	this.inPlay = true;
	
}

jet.prototype.drawJet = function() {
	ctx.drawImage(this.img, this.xPos, this.yPos);	
};

jet.prototype.jetCollision = function() {
	var jetXW = this.xPos + this.width, // xw
		jetYH = this.yPos + this.height; //yh
	
	// HIT DETECTION FOR JET ON ALL FOUR SIDES
	for (var i = 0; i < enemies.length; i++) {
		if (jet.xPos > enemies[i][0] && jet.xPos < enemies[i][0] + enemy.width && jet.yPos > enemies[i][1] && jet.yPos < enemies[i][1] + enemy.height) {
		  life.checkLife();
		}
		if (jetXW < enemies[i][0] + enemy.width && jetXW > enemies[i][0] && jet.yPos > enemies[i][1] && jet.yPos < enemies[i][1] + enemy.height) {
		  life.checkLife();
		}
		if (jetYH > enemies[i][1] && jetYH < enemies[i][1] + enemy.height && jet.xPos > enemies[i][0] && jet.xPos < enemies[i][0] + enemy.width) {
		  life.checkLife();
		}
		if (jetYH > enemies[i][1] && jetYH < enemies[i][1] + enemy.height && jetXW < enemies[i][0] + enemy.width && jetXW > enemies[i][0]) {
		  life.checkLife();
		}
	}
};

var jet = new jet();

//-------------------------------------------------------------------------------------------//
// ENEMY ------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

function enemy() {
	this.img = new Image();
	this.img.src = "assets/enemy.png";
	this.xPos = 50;
	this.yPos = 45; // OFF CANVAS
	this.width = 50;
	this.height = 57;
	this.speed = 3;
	this.total = 5;
 	this.pointValue = 10;
}

enemy.prototype.updateEnemies = function() {
	enemies.push([(Math.random() * 500) + 50, -45, this.width, this.height, this.speed]);
}

// INITIALIZE ENEMIES
enemy.prototype.initializeEnemy = function() {
	for (var i = 0; i < this.total; i++) {
		enemies.push([this.xPos, (Math.random() * 100) + this.yPos, this.width, this.height, this.speed]);
		this.xPos += this.width + 65; // SPACE JETS EVENLY ACROSS X FOR FIRST WAVE
	}
}

// DRAW ENEMY
enemy.prototype.drawEnemy = function() {
	for (var i = 0; i < enemies.length; i++) {
 		ctx.drawImage(this.img, enemies[i][0], enemies[i][1]);
	}
}

// MOVE ENEMY
enemy.prototype.moveEnemy = function() {
 	for (var i = 0; i < enemies.length; i++) {
		if (enemies[i][1] < height) {
		  enemies[i][1] += enemies[i][4];
		} else if (enemies[i][1] > height - 1) {
		  enemies[i][1] = -45;
		}
 	}
}

var enemy = new enemy();

//-------------------------------------------------------------------------------------------//
// ROCKETS ----------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

function rocket() {
	this.img = new Image();
	this.img.src = "assets/rocket2.png";
	this.width = 10; //2
	this.height = 30; //10
 	this.rocketCount = 2;
	this.speed = 4;
}

rocket.prototype.drawRocket = function() {
	console.log("Draw rocket")
	if(rockets.length) {
		for (var i = 0; i < rockets.length; i++) {
 		 	ctx.drawImage(this.img, rockets[i][0], rockets[i][1], rockets[i][2], rockets[i][3])
		}
	}
}

rocket.prototype.moveRocket = function() {
	for (var i = 0; i < rockets.length; i++) {
		// ROCKET VISIBLE ON CANVAS
		if(rockets[i][1] > -21) { //11
			rockets[i][1] -= 20; //10
		// ROCKET NOT VISIBLE - REMOVE FROM ARRAY
		} else if (rockets[i][1] < -20) { //10
			rockets.splice(i,1);
		}
	}
}

var rocket = new rocket();

//-------------------------------------------------------------------------------------------//
// START SCREEN -----------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

function startScreen() {
	this.font = "bold 80px Press Start 2P";
	this.color = "#fff";
	this.title = "TYPHOON FIGHTER";
	this.img = new Image();
	this.img.src = "assets/title.png";
	this.titlexPos = x - 150;
	this.titleyPos = height / 2;
	this.startInstructions = "Click to play";
	this.startInstructionsyPos = height / 2 + 20;
	this.moveInstructions = "Use arrow keys to move jet";
	this.moveInstructionsyPos = height / 2 + 80;
	this.shootInstructions = "Press spacebar to fire rockets";
	this.shootInstructionsyPos = height / 2 + 100;
	this.pauseInstructions = "Press P to pause and unpause";
	this.pauseInstructionsyPos = height / 2 + 120;
}

startScreen.prototype.drawStartScreen = function() {
	ctx.font = this.font;
	ctx.fillStyle = this.color;
	ctx.drawImage(this.img, 0, 0);
	//ctx.textAlign = "center"; 
	//ctx.fillText(this.title, x, this.titleyPos);
	ctx.textAlign = "center";
	ctx.fillText(this.startInstructions, x, this.startInstructionsyPos);
	ctx.textAlign = "center";
	ctx.fillText(this.moveInstructions, x, this.moveInstructionsyPos);
	ctx.textAlign = "center";
	ctx.fillText(this.shootInstructions, x, this.shootInstructionsyPos);
	ctx.textAlign = "center";
	ctx.fillText(this.pauseInstructions, x, this.pauseInstructionsyPos);
}

var startScreen = new startScreen();

//-------------------------------------------------------------------------------------------//
// SCORING ----------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

function points() {
	this.font = "bold 14px Press_Start_2P";
	this.color = "#fff";
	this.width = 490;
	this.height = 30;
	this.scoreText = "Score:";
	this.gameOverText = "Game Over";
	this.continueText = "- Click To Continue -";
	this.leftPadding = 300;
	this.yPos = 50;
	this.scoreTextxPos = 10;
	this.scorePointxPos = 100;
}

points.prototype.drawScore = function() {
	ctx.font = this.font;
	ctx.fillStyle = this.color;
	ctx.textAlign = "left";
 	ctx.fillText(this.scoreText, this.scoreTextxPos, this.yPos);
 	ctx.textAlign = "left";
 	ctx.fillText(score, this.scorePointxPos, this.yPos);
	
	// ADD LEVEL SECTION HERE - SPEED INCREASE IS JUST ONE EXAMPLE
	if(score > 200 ) { 
		enemy.speed = 6;
		level.level = 2;
	}
	
	if(score > 400 ) {
		enemy.speed = 9;
		level.level = 3;
	}
	
	if(score > 600 ) { 
		enemy.speed = 12;
		level.level = 4;
	}
	
	// BONUS HIT - IF NOT TRUE SHOW BONUS - IF STIKE THEN REMOVE BONUS
	if(!bonusHit) {
		if(score > 200 && score < 300 ) { 
			// show bonus
			bonusToggle = true;
		} else {
			bonusToggle = false;
		}

 	} else {
		bonusToggle = false;
	}
	// END BONUS HIT
	
	// GAME OVER AND CONTINUE
	if(!jet.inPlay) {
		ctx.font = this.font;
		ctx.fillStyle = this.color;
		ctx.textAlign = "center";
 		ctx.fillText(this.gameOverText, x, height / 2);
		ctx.textAlign = "center";
		ctx.fillText(this.continueText, x, (height / 2) + 35);
		// CONTINUE
		canvas.addEventListener("click", continueClick, false);
	}
}

var points = new points();

//-------------------------------------------------------------------------------------------//
// STRIKE DETECTION -------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

function strikeDetection() {
	var removeFlag = false;
	// ITERATE OVER NUMBER OF ROCKETS
	for (var i = 0; i < rockets.length; i++) {
		
		// ITERATE OVER NUMBER OF ENEMIES
		for (var j = 0; j < enemies.length; j++) {
		
		 // CHECK IF A ROCKET STRIKES AN ENEMY - X, Y, W, H
		 if (rockets[i][1] <= (enemies[j][1] + enemies[j][3]) && rockets[i][0] >= enemies[j][0] && rockets[i][0] <= (enemies[j][0] + enemies[j][2])) {

			// PLAY SOUND
			playSound("enemyStrikeSound");

			removeFlag = true;
			// REMOVE STRUCK ENEMY
			enemies.splice(j, 1);
			// ADD SCORE
			score += enemy.pointValue;
			// ADD MORE RANDOM ENEMIES
 			// x, y, w, h
			// REPLENISH ENEMIES - ADD LEVELS, CHANGE GAME SPEED ETC HERE
			enemy.updateEnemies();
		  }		
		}

		if (removeFlag == true) {
			rockets.splice(i, 1);
			removeFlag = false;
		}
 	}
}

//-------------------------------------------------------------------------------------------//
// LEVEL ------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//
function level() {
	this.font = "bold 14px Press_Start_2P";
	this.level = 1;
	this.levelText = "Level:";
	this.xPos = 10;
	this.yPos = 70; 
	this.leftPadding = 100;
}

level.prototype.drawLevel = function () {
	ctx.textAlign = "left";
	ctx.fillText(this.levelText, this.xPos, this.yPos);
	ctx.textAlign = "left";
	ctx.fillText(this.level, this.leftPadding, this.yPos);
}

var level = new level();

//-------------------------------------------------------------------------------------------//
// PLAYER LIFE ------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

function life() {
	this.life = 3;
	this.font = "bold 14px Press_Start_2P";
	this.color = "#fff";
	this.lifeText = "Lives:";
	this.xPos = 10;
	this.yPos = 30;
	this.leftPadding = 100;
}

life.prototype.drawLife = function() {
	ctx.textAlign = "left";
	ctx.fillText(this.lifeText, this.xPos, this.yPos);
	ctx.textAlign = "left";
	ctx.fillText(this.life, this.leftPadding, this.yPos);
}

life.prototype.checkLife = function() {
	// PLAY SOUND
	playSound("jetStrikeSound");
	this.life -= 1;
	if(this.life > 0) {
		reset(); // NOT FUNCTIONING
	} else if (this.life == 0) {
		jet.inPlay = false;
	}
}

var life = new life();


//-------------------------------------------------------------------------------------------//
// CREDITS ----------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

function credits() {
 	this.font = "bold 14px Press_Start_2P";
	this.title = "Typhoon Fighter Game Credits";
	this.author = "Created by: Shaun Nelson";
	this.line = "-----------------------";
	this.email = "shaun@shaunnelson.com";
	this.website = "www.shaunnelson.com";
	this.version = "Version: 3.1";
	this.instruction = "Press C to continue";
}

credits.prototype.drawCredits = function() {
	ctx.font = this.font;
	ctx.textAlign = "center";
	ctx.fillText(this.title, x, height / 2);
	ctx.textAlign = "center";
	ctx.fillText(this.line, x, height / 2 + 20);
	ctx.textAlign = "center";
	ctx.fillText(this.author, x, height / 2 + 40);
	ctx.textAlign = "center";
	ctx.fillText(this.email, x, height / 2 + 60);
	ctx.textAlign = "center";
	ctx.fillText(this.website, x, height / 2 + 80);
	ctx.textAlign = "center";
	ctx.fillText(this.version, x, height / 2 + 100);
	ctx.textAlign = "center";
	ctx.fillText(this.instruction, x, height / 2 + 120);
}

var credits = new credits();

function showCredits() {
	if(jet.inPlay  && startGameToggle && life.life > 0) {
		if (!creditToggle) {
			creditToggle = true;
			// CLEAR TIMEOUT OF LOOP
			clearTimeout(loopGame);
			credits.drawCredits();
		} else if (creditToggle) {
		   creditToggle = false;
		   // SET TIMEOUT VARIABLE AGAIN
		   loopGame = setTimeout(gameLoop, 1000 / 30);
		}
	}
}

//-------------------------------------------------------------------------------------------//
// KEYBOARD CONTROL -------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

// MAP WHATEVER KEYS YOU WISH, BELOW IS FOR REFERENCE
// 39 - right
// 37 - left
// 38 - up
// 40 - down

// 68 - d - right
// 65 - a - left
// 87 - w - up
// 83 - s - down

// 32 - spacebar - fire

// 80 - pause - HANDLED WITH EVENT LISTENER DUE TO LOOPING

// 67 - credits

function checkKeys() {
  // UP
  if (keyPress[38]) {
    if (jet.yPos > 0) {
      jet.yPos -= jet.speed;
    }
  }
  // DOWN
  if (keyPress[40]) {
    if (jet.yPos < (canvas.height - jet.height)) {
      jet.yPos += jet.speed;
    }
  }
  // RIGHT
  if(keyPress[39]) {
     if (jet.xPos < (canvas.width - jet.width)) {
      jet.xPos += jet.speed;
    }
  }
  
  // LEFT
  if(keyPress[37]) {
     if (jet.xPos > 0) {
      jet.xPos -= jet.speed;
    }
  }
  
 // FIRE ROCKETS
 if(keyPress[32] && rockets.length <= rocket.rocketCount) {
 	rockets.push([jet.xPos + 25, jet.yPos - 20, rocket.width, rocket.height]);//x, y, w, h
 	// PLAY SOUND
	playSound("rocketSound");
 }

}

//-------------------------------------------------------------------------------------------//
// EVENT LISTENERS --------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

// EVENT LISTENERS - FOR KEYBOARD
document.addEventListener("keydown", function(e) {
  keyPress[e.keyCode] = true;
  // PAUSE
  if (e.keyCode == 80 && creditToggle !== true) { pauseGame(); }
  // CREDITS
  if (e.keyCode == 67 && pauseToggle !== true) { showCredits();}
});

// REMOVE PREVIOUSLY PRESSED KEY
document.addEventListener("keyup", function(e) {
  delete keyPress[e.keyCode];
});

// CLICK ANYWHERE IN CANVAS TO START GAME
canvas.addEventListener("click", startGame, false);


//-------------------------------------------------------------------------------------------//
// GAME SETUP AND LOOP ----------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

// ADD BONUS POINTS
bonusPoints.addPoints();
// INITIALIZE ENEMY
enemy.initializeEnemy();

function gameLoop() {
	clearCanvas(ctx);

 	background.drawBackground();
	clouds.drawClouds();

	if(!startGameToggle) {
		startScreen.drawStartScreen();
	}
	
	// IF JET IN PLAY - TRUE AND GREATER THAN 0
	if(jet.inPlay && startGameToggle && life.life > 0) {
		strikeDetection();
 		jet.jetCollision();

		// BONUS TOGGLE TRUE
		if(bonusToggle) {
			bonusStrike();
			bonusPoints.moveBonusPoints();
			bonusPoints.drawBonusPoints();
		}
 		
		enemy.drawEnemy();
		enemy.moveEnemy();
		jet.drawJet();

		rocket.moveRocket();
		rocket.drawRocket();
		checkKeys();

	
	points.drawScore();
	life.drawLife();
	level.drawLevel();

	}

	// SHOW CONTINUE SCREEN AND POINTS
	if(life.life == 0) {
 		points.drawScore();
		life.drawLife();
		level.drawLevel(); 
	}

 
	
	// VARIABLE REQUIRED FOR PAUSE
	loopGame = setTimeout(gameLoop, 1000 / 60); //30 FPS

}

//-------------------------------------------------------------------------------------------//
// REQUEST ANIMATION FRAME WITH FALLBACK ------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

function requestAnimateFrame(a) {
	return requestAnimationFrame(a) ||
 			webkitRequestAnimationFrame(a) ||
			   mozRequestAnimationFrame(a) ||
			   function(callback) {
 					setTimeout(a, 1000 / 60);
			   }
}

//-------------------------------------------------------------------------------------------//
// RENDER -----------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------//

gameLoop();
