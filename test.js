
var canvas = null;
var ctx = null;

var keyMap = [];
var inputDelay = new InputDelay(4);

var turtle = null;
var gridSizeX = 20;
var gridSizeY = 20;
var space = 20;
var myGrid = null;
var enemyList = [];
var wallList = [];

var turtleImage = new Image();
var enemyImage = new Image();
var turtleSpriteSheet = null;
var turtleWalk = null;
var stage = null;

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

	stage = new createjs.Stage("c");

	setInterval(checkInput, 1000/30);

	//image stuff
	turtleImage.onload = function(){
		turtleSpriteSheet = new createjs.SpriteSheet({
			images: [turtleImage],
			frames: {width: 95, height: 90, regX:0 , regY:0 },
			animations: {
				walk: [0,12 , "walk"],
				prone: [72,71, "prone"]
			}
		});

		turtleWalk = new createjs.Sprite(turtleSpriteSheet, "walk");


		turtleWalk.name = "turtle";

		stage.addChild(turtleWalk);
		init();
	};
	turtleImage.onerror = function(){
		console.err("failed to load turtleImage");
	};
	turtleImage.src = "assets/turtle.png";

	//
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
	refresh();
	draw();
}

function draw() {

	//drawBackground();
	myGrid.draw(0,0);
	//drawEntities();
	//drawOverlay();

	window.requestAnimationFrame(draw);
}

function refresh(){
	myGrid.refresh();
	inputDelay.tick();
}

function Grid(rows, cols, spacing){
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
	ctx.translate(x,y);
	for(var i = 0; i < this.rows; i++){
		for(var j = 0; j < this.cols; j++){

			
			if((i+j)%2 == 0) ctx.fillStyle = "gray";
			else ctx.fillStyle = "white";

			ctx.fillRect(j*this.spacing, i*this.spacing, this.spacing, this.spacing);
		}
	}
	ctx.setTransform(1,0,0,1,0,0);
	for(var i = 0; i < this.rows; i++){
		for(var j = 0; j < this.cols; j++){

			
			ctx.translate(j*this.spacing, i*this.spacing);
			ctx.scale(1,1);
			this.grid[j][i].draw();
			ctx.setTransform(1,0,0,1,0,0);
		}
	}
	ctx.setTransform(1,0,0,1,0,0);
}

Grid.prototype.refresh = function(){
	this.clear();
	this.insert(turtle);
}

function Turtle(x,y,dir){
	this.x = x;
	this.y = y;
	this.dir = dir;
	

}

Turtle.prototype.draw = function(){
	ctx.fillStyle = "green";
	ctx.fillRect(0,0,myGrid.spacing,myGrid.spacing);
	ctx.save();
	ctx.translate(myGrid.spacing/2,myGrid.spacing/2);
	ctx.rotate(this.dir*2*Math.PI/8);
	ctx.fillStyle = "black";
	ctx.fillRect(0,0-myGrid.spacing/8,4*myGrid.spacing/3, myGrid.spacing/4);
	turtleWalk.x = this.x;
	turtleWalk.y = this.y;
	turtleWalk.scaleX = 1;
	turtleWalk.scaleY = 1;
	turtleWalk.dir = 0;
	turtleWalk.gotoAndPlay("walk");
	stage.update();
	//turtleWalk.draw(ctx,1);
	ctx.restore();

}

Turtle.prototype.move = function(message){
	inputDelay.lock();
	console.log(message);

	var x = this.x;
	var y = this.y;

	if(message === "cc") {
		this.dir = (this.dir-1) % 8;
	}
	else if( message === "clockwise"){
		this.dir = (8+this.dir+1)%8;
	}
	else if(message === "north-west"){
		x -=1;
		y -=1;
	}
	else if(message === "north"){
		y -=1;
	}
	else if(message === "north-east"){
		x +=1;
		y -=1;
	}
	else if(message === "west"){
		x-=1;
	}
	else if(message === "wait"){

	}
	else if(message === "east"){
		x+=1;
	}
	else if(message === "south-west"){
		x-=1;
		y+=1;
	}
	else if(message === "south"){
		y+=1;
	}
	else if(message === "south-east"){
		x+=1;
		y+=1;
	}

	if(walkable(this, x, y)){
		this.x = x;
		this.y = y;
	}
}

function walkable(entity, x, y){
	console.log(x + ' ' + y);
	if(myGrid.grid[y][x] === entity) return true;
	if(myGrid.grid[y][x].walkable) return true;

	return false;
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

