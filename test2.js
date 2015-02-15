
var ctx = null;

var keyMap = {};
var inputDelay = new InputDelay(2);

var turtle = null;
var enemyList = [];
var wallList = [];

var turtleImage = new Image();
var enemyImage = new Image();
var turtleSpriteSheet = null;
var enemySpriteSheet = null;
var explosion = null;

var enemy = null;
var turtleWalk = null;
var stage = null;

window.onload = function(){
	console.log(createjs);

	canvas = document.getElementById("c");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	window.onresize = function(){
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	};

	ctx = canvas.getContext("2d");
	document.body.addEventListener("keydown", keyMapper);
	document.body.addEventListener("keyup", keyMapper);


	spriteShit();


	
	init();
};

function spriteShit(){

	turtleSpriteSheet = new createjs.SpriteSheet({
		images: ["assets/turtles.png", "assets/explosion.png"],
		frames: {width:73,height:115,count:4,regX:36,regY:57},
		animations: {
			walk: [0,1 , "walk", .1],
			prone: [2,3, "prone", .1]
		}
	});

	turtleWalk = new createjs.Sprite(turtleSpriteSheet, "walk");

	turtleWalk.name = "turtle";



turtleSpriteSheet = new createjs.SpriteSheet({
		images: ["assets/turtles.png", "assets/explosion.png"],
		frames: {width:73,height:115,count:4,regX:36,regY:57},
		animations: {
			walk: [0,1 , "walk", .1],
			prone: [2,3, "prone", .1]
		}
	});

	turtleWalk = new createjs.Sprite(turtleSpriteSheet, "walk");

	turtleWalk.name = "turtle";
	var explosionSpriteData = {
		images: ["assets/explosion.png"],
		frames: {width:800/15, height:53, count:15, regX:400/15,regY:53},
		animations: {
			explode:[0,15, "explode", .6]
		}
	};
	explosion = new createjs.Sprite(new createjs.SpriteSheet(explosionSpriteData),"explode");


	var enemySpriteData = {
		images: ["assets/soldiers.png"],
		frames: [
		//death
			[14, 445,43, 45],
			[57, 445,45, 45],
			[105,445,52,45],
			[157,445,56, 45],
			[213,445,60, 45],
			[274,445,62,45],
			[336,445,63,45],
			[399,445,63,45],
			[462,445,72,45],
			[536,445,75,45],
			[14,496,72,45],
			[93,496,73, 45],
			[177,496,74,45],
			[262,496,76,45],
			[347,496,73,45],
			[432,496,74,45],
			[516,496,30,45],
			[555,496,31,45],
		// chillin
			[352,72,28,38],
			[389,72,28,38],
			[424,72,28,38],
			[456,72,28,38]
		],
		animations: {
			death:[0,17,"death", .5],
			chillin:[18,21,"chillin", .1]
		}
	};

	enemySpriteSheet = new createjs.SpriteSheet(enemySpriteData);

	enemy = new createjs.Sprite(enemySpriteSheet, "walk");
		enemy.name = "enemy";


}
function handleTick(event){
	stage.update();
	inputDelay.tick();
	checkInput();
}
function InputDelay(delay){

	this.delay = delay;
	this.iter = 0;
	this.lock = function(){
		this.iter = this.delay;
	}
	this.tick = function(){
		if(this.iter > 0) {
			this.iter--;
		}
	}
	this.locked = function(){
		return this.iter !== 0;
	}
}

function keyMapper(e){
	// won't work on chrome afaik
	keyMap[e.key] = e.type == "keydown";
}
function init(){
	// grid must go first!
	turtle = new Turtle(canvas.width/2, canvas.height/2,0);
/**
 * @param {[type]} [varname] [description]
 * @constructor 
 */
		
	stage = new createjs.Stage("c");
	stage.addChild(turtleWalk);
	stage.addChild(enemy);
	stage.addChild(explosion);
	createjs.Ticker.addEventListener("tick", handleTick);
	turtleWalk.gotoAndPlay("prone");
	enemy.x = 100;
	enemy.y = 100;
	enemy.scaleX = 3;
	enemy.scaleY = 3;
	enemy.gotoAndPlay("death");
	explosion.x = 400;
	explosion.y = 100;
	explosion.scaleX = 1.5;
	explosion.scaleY = 1.5;
	explosion.gotoAndPlay("explode");
	createjs.Tween.get(explosion,{loop:true}).to({rotation:359}, 3000);
}


function checkInput(){
	if(!inputDelay.locked()) {
		if(keyMap['q']) turtle.move('cc');
		else if(keyMap['w']) turtle.move('clockwise');
		else if(keyMap['7']) turtle.move('north-west');
		else if(keyMap['8']) turtle.move('north');
		else if(keyMap['9']) turtle.move('north-east');
		else if(keyMap['u']) turtle.move('west');
		else if(keyMap['i']) turtle.move('wait');
		else if(keyMap['o']) turtle.move('east');
		else if(keyMap['j']) turtle.move('south-west');
		else if(keyMap['k']) turtle.move('south');
		else if(keyMap['l']) turtle.move('south-east');

		else if(turtle.sprite.currentAnimation == "walk") turtle.sprite.gotoAndPlay("prone");
	}
}

function Turtle(x,y,dir){
	this.x = x;
	this.y = y;
	this.speed = 1;
	this.rotSpeed = 10;
	this.dir = dir;
	this.sprite = turtleWalk;
	this.sprite.x = x;
	this.sprite.y = y;
	this._noTween = false;

}



Turtle.prototype.move = function(message){
	inputDelay.lock();
	console.log(message);

	var x = this.x;
	var y = this.y;
	var dir = this.dir;

	if(message === "cc") {
		dir = (dir-this.rotSpeed) % 360;
		this.sprite.rotation++;
	}
	else if( message === "clockwise"){
		dir = (360+dir+this.rotSpeed)%360;
		this.sprite.rotation--;
	}
	else if(message === "north-west"){
		x -=this.speed;
		y -=this.speed;
	}
	else if(message === "north"){
		y -= this.speed;
	}
	else if(message === "north-east"){
		x +=this.speed;
		y -=this.speed;
	}
	else if(message === "west"){
		x-=this.speed;
	}
	else if(message === "wait"){

	}
	else if(message === "east"){
		x+=this.speed;
	}
	else if(message === "south-west"){
		x-=this.speed;
		y+=this.speed;
	}
	else if(message === "south"){
		y+=this.speed;
	}
	else if(message === "south-east"){
		x+=this.speed;
		y+=this.speed;
	}
 if(turtleWalk.currentAnimation == "prone") { 
 	turtleWalk.gotoAndPlay("walk");


}
	this.x = x;
	this.y = y;
	this.sprite.x = x;
	this.sprite.y = y;
}