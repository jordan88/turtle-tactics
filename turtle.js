/**
 * 
 * 
 * turtle tactics is quite a mess
 */
var canvas = null;
var ctx = null;

var keyMap = [];
var inputDelay = new InputDelay(4);
var animationDelay = new InputDelay(5);
var turtle = null;
var gridSizeX = 20;
var gridSizeY = 20;
var space = 30;
var myGrid = null;
var enemyList = [];
var wallList = [];

var turtleImage = new Image();
var enemyImage = new Image();
var turtleSpriteSheet = null;
var turtleWalk = null;
var stage = null;
var gridGraphic = null;
var gridShape = null;

window.onload = function(){
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


	gridShape = new createjs.Shape();

	stage = new createjs.Stage("c");
	createjs.Ticker.addEventListener("tick", handleTick);

	//image stuff
	turtleImage.onload = function(){
		loadHandler();
	};
	turtleImage.onerror = function(){
		console.err("failed to load turtleImage");
	};
	turtleImage.src = "assets/turtles.png";

}

function loadHandler(event){
	turtleSpriteSheet = new createjs.SpriteSheet({
		images: [turtleImage],
		frames: {width: 73, height: 115, count:4, regX:36 , regY:57 },
		animations: {
			walk: [0,1 , "walk"],
			prone: [2,3, "prone"]
		}
	});

	turtleWalk = new createjs.Sprite(turtleSpriteSheet, "prone");
	
	init();
}

function handleTick(event){
	stage.update();
}


function keyMapper(e){
	// won't work on chrome afaik
	keyMap[e.key] = e.type == "keydown";
}

function checkInput(){
	if(!inputDelay.locked()) {
		if(keyMap['q']) turtle.move('cc');
		if(keyMap['w']) turtle.move('clockwise');
		if(keyMap['7']) turtle.move('north-west');
		if(keyMap['8']) turtle.move('north');
		if(keyMap['9']) turtle.move('north-east');
		if(keyMap['u']) turtle.move('west');
		if(keyMap['i']) turtle.move('wait');
		if(keyMap['o']) turtle.move('east');
		if(keyMap['j']) turtle.move('south-west');
		if(keyMap['k']) turtle.move('south');
		if(keyMap['l']) turtle.move('south-east');
	}
	refresh();
}

function InputDelay(delay){

	this.delay = delay;
	this.iter = 0;
	this.lock = function(){
		this.iter = this.delay;
	}
	this.unlock = function(){
		this.iter = 0;
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

function init(){
	// grid must go first!
	myGrid = new Grid(gridSizeX,gridSizeY,space);
	turtle = new Turtle(myGrid.x/2,myGrid.y/2, 0);
	setInterval(checkInput, 1000/30);
	refresh();
}


function refresh(){
	myGrid.refresh();
	inputDelay.tick();
}

function Grid(cols,rows, spacing){
	this.grid = [];

	this.rows = this.y = rows;
	this.cols = this.x = cols;
	this.spacing = spacing;

	for(var i = 0; i < this.rows; i++){

		var tmp = [];
		for(var j = 0; j < this.cols; j++){
			tmp.push(new Empty(j,i));
		}
		this.grid.push(tmp);
	}

	this.gridShape = new createjs.Shape();
	stage.addChild(this.gridShape);

	for(var i = 0; i < this.rows; i++){
		for(var j = 0; j < this.cols; j++){

			var coord = this.gridToPixel(i,j);

			if((i+j)%2 == 0) this.gridShape.graphics.beginFill("#ff0000").drawRect(coord.x,coord.y, this.spacing,this.spacing);
			else this.gridShape.graphics.beginFill("#000000").drawRect(coord.x,coord.y, this.spacing,this.spacing);

			
		}
	}




}

Grid.prototype.insert = function(entity){
	this.grid[entity.x][entity.y] = entity;
}

Grid.prototype.clear = function(){
	for(var i = 0; i < this.rows; i++){
		for(var j = 0; j < this.cols; j++){
			this.grid[j][i] = new Empty(j,i);
		}
	}
}

Grid.prototype.draw = function(x, y){
	
	for(var i = 0; i < this.rows; i++){
		for(var j = 0; j < this.cols; j++){

		}
	}
}

Grid.prototype.refresh = function(){
	this.clear();
	this.insert(turtle);
}

Grid.prototype.gridToPixel = function(x,y){
	return {x:this.spacing*x, y:this.spacing*y};
};

function Turtle(x,y,dir){
	this.x = x;
	this.y = y;
	this.dir = dir;

	stage.addChild(turtleWalk);
	this.animation = turtleWalk;

	var coord = myGrid.gridToPixel(this.x,this.y);
	this.animation.x = coord.x+myGrid.spacing/2;
	this.animation.y = coord.y+myGrid.spacing/2;
	this.animation.scaleX = myGrid.spacing/115;
	this.animation.scaleY = myGrid.spacing/115;
	this.animation.play();
}

Turtle.prototype.draw = function(){
	ctx.fillStyle = "green";
	ctx.fillRect(0,0,myGrid.spacing,myGrid.spacing);
	ctx.save();
	ctx.translate(myGrid.spacing/2,myGrid.spacing/2);
	ctx.rotate(this.dir*2*Math.PI/8);
	ctx.fillStyle = "black";
	ctx.fillRect(0,0-myGrid.spacing/8,4*myGrid.spacing/3, myGrid.spacing/4);
	turtleWalk.scaleX = .4;
	turtleWalk.scaleY = .4;
	turtleWalk.gotoAndPlay("prone");
	ctx.restore();
}

Turtle.prototype.move = function(message){

	inputDelay.lock();
	console.log(message);

	var x = this.x;
	var y = this.y;
	var dir = this.dir;
	var _self = this;

	function rotate(){
		_self.animation.gotoAndPlay("walk");
		createjs.Tween.get(_self.animation)
		.to({rotation:dir*360/8}, 300, function(x){
			return (x+360) % 360;
		})
		.call(function() {
				_self.animation.gotoAndPlay("prone");
		});

		// set dir
		_self.dir = dir;
	}

	function move(){
		if(walkable(_self, x, y)) {
			var currCoord = myGrid.gridToPixel(x,y);

			_self.animation.gotoAndPlay("walk");
			createjs.Tween.get(_self.animation)
			.to({x:currCoord.x+myGrid.spacing/2, y:currCoord.y+myGrid.spacing/2}, 500)
			.call(function(){
				_self.animation.gotoAndPlay("prone");
				
			});

			_self.x = x;
			_self.y = y;

		}
	
	}

	if(message === "cc") {
		dir = (8+dir-1) % 8;
		rotate();
	}
	else if( message === "clockwise"){
		dir = (8+dir+1)%8;
		rotate();
	}
	else if(message === "north-west"){
		x -=1;
		y -=1;
		move();
	}
	else if(message === "north"){
		y -=1;
		move();
	}
	else if(message === "north-east"){
		x +=1;
		y -=1;
		move();
	}
	else if(message === "west"){
		x-=1;
		move();
	}
	else if(message === "wait"){
		move();
	}
	else if(message === "east"){
		x+=1;
		move();
	}
	else if(message === "south-west"){
		x-=1;
		y+=1;
		move();
	}
	else if(message === "south"){
		y+=1;
		move();
	}
	else if(message === "south-east"){
		x+=1;
		y+=1;
		move();
	}

	
}

function walkable(entity, x, y){
	return true;
}

// wrapper, give empty stuff
function Empty(x, y){
	this.x = x;
	this.y = y;
}

Empty.prototype.walkable = true;

Empty.prototype.draw = function(){}

function moveEnemies(){
	for(var i = 0; i < enemyList.length;i++){
		enemyList[i].move();
	}
}

function Enemy(x, y){
	this.x = x;
	this.y = y;
}

Enemy.prototype.move = function(){
	
}