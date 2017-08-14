var FPS = 60;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function convertForTan(x){
	return x;
}

// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     ||  
		function( callback ){
			return window.setTimeout(callback, 1000 / FPS);
		};
})();

window.cancelRequestAnimFrame = ( function() {
	return window.cancelAnimationFrame          ||
		window.webkitCancelRequestAnimationFrame    ||
		window.mozCancelRequestAnimationFrame       ||
		window.oCancelRequestAnimationFrame     ||
		window.msCancelRequestAnimationFrame        ||
		clearTimeout
} )();

// Initialize some stuff
var canvas = document.querySelector('#game'),
    ctx = canvas.getContext('2d'),
    W = canvas.width,
    H = canvas.height,
    CL = 0, //camera left and camera top , used for camera following the player , yeah im dumb
    CT = 0,
	speed = 300 / FPS,
    init,
    mouse = {},
    startBtn = {},up,down,left,right,
    restartBtn = {};

// Add mousemove and mousedown events to the canvas
canvas.addEventListener("mousemove", trackPosition, true);
canvas.addEventListener("mousedown", btnClick, true);
canvas.addEventListener("keydown", fixedUpdate , true);
canvas.addEventListener("keyup",stopmoving,true)

ctx.shadowBlur = 0;

// Track the position of mouse cursor
function trackPosition(e) {
	mouse.x = e.pageX + canvas.offsetleft;
	mouse.y = e.pageY + canvas.offsettop;
}

// Ball object
ball = {
	x: W/2,
	y: H/2, 
	r: 10,
	c: "white",
	speed: 10,
	// Function for drawing ball on canvas
	draw: function() {
		ctx.beginPath();
		ctx.fillStyle = this.c;
		ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		ctx.fill();
		
	}
};

function ball2() {
	this.x = W/2;
	this.y = H/2; 
	this.r = 10;
	this.fx = getRandomInt(0 , 100);
	this.fy = getRandomInt(0 , 100);
	this.c = "green";
	this.speed =  10;
	// Function for drawing ball on canvas
	this.draw = function() {
		ctx.beginPath();
		ctx.fillStyle = this.c;
		ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		ctx.fill();
		
	}
};

function creature(type , c1 , ec){
	this.x = W/2;
	this.y = H/2;
	this.fx = getRandomInt(0 , 400);
	this.fy = getRandomInt(0 , 400);
	this.r = 0;
	this.ro = 0;
	this.c1 = (c1 || "white");
	this.ec = (ec || "red");
	this.type = (type || "player");
	this.w = (this.type === "player" ? 40 : 20 ); 
	this.h = 1.1 * this.w;
	this.draw = function(){
		ctx.beginPath();
		ctx.shadowColor = this.c1;
		if (this.r){
			//eyes
			ctx.fillStyle = this.ec;
			ctx.fillRect(this.x + this.w / 3  - this.ro * this.w * 2 / 15 , this.y - this.h * 6 / 10 , this.h / 7 , this.w / 5);
			ctx.fillRect(this.x + this.w * 2 / 3 - this.ro * this.w * 2 / 15 , this.y - this.h * 6 / 10 , this.h / 7 , this.w / 5);
		}
		ctx.fillStyle = this.c1;
		//body
		ctx.fillRect(this.x, this.y, this.w ,this.h);
		//head
		ctx.fillRect(this.x + this.w / 4 , this.y - this.h / 2 , this.h / 2 , this.w / 2);
		//legs
		ctx.fillRect(this.x + this.w / 8, this.y + this.h * 1.1, this.w / 4 ,this.h * 1.1 / 4);
		ctx.fillRect(this.x + this.w * 5/8 , this.y + this.h * 1.1, this.w / 4 ,this.h * 1.1 / 4);
		//hands
		ctx.fillRect(this.x - this.w / 4 , this.y, this.w / 4 ,this.h * 5 / 6);
		ctx.fillRect(this.x + this.w , this.y, this.w / 4 ,this.h * 5 / 6);
		if (!this.r){
			//eyes
			ctx.fillStyle = this.ec;
			ctx.fillRect(this.x + this.w / 3 - this.ro * this.w * 2 / 15 , this.y - this.h * 6 / 10 , this.h / 7 , this.w / 5);
			ctx.fillRect(this.x + this.w * 2 / 3 - this.ro * this.w * 2 / 15, this.y - this.h * 6 / 10 , this.h / 7 , this.w / 5);
		}
		
		

	}
};

function wall(){

};


var player = new creature();

ballArr = [];
for(var i = 0 ; i < 2 ; i++){
	ballArr[i] = new creature("monster", "red" , "white");
	ballArr[i].x = ballArr[i].fx;
	ballArr[i].y = ballArr[i].fy;
}

// Start Button object
startBtn = {
	w: 150,
	h: 100,
	x: W/2 - 75,
	y: H/2 - 50,
	
	draw: function() {
		ctx.beginPath();
		ctx.strokeStyle = "white";
        ctx.fillStyle = "white";

		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		
		ctx.font = "30px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("Start", W/2, H/2 );
	}
};


// Function for (re)start
function start() {
	
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, W, H);
	
}

function fixedUpdate(e){
	var code = e.keyCode;
    if (code == 87 && !up){
		up = setInterval(function(){
			CT -= speed;
		}, 1000/FPS);
		player.r = 1;
	}
	else if(code == 83 && !down){
		down = setInterval(function(){
			CT += speed;
		}, 1000/FPS);
		player.r = 0;
	}
	else if(code == 65 && !left){
		left = setInterval(function(){
			CL -= speed;
		}, 1000/FPS);
		player.ro = 1;
	}
	else if(code == 68 && !right){
		right = setInterval(function(){
			CL += speed;
		}, 1000/FPS);
		player.ro = 0;
	}
}

function stopmoving(e){
	var code = e.keyCode;
    if (code == 87 && up){
		clearInterval(up);
		up = 0;
	}
	else if(code == 83 && down){
		clearInterval(down);
		down = 0;
	}
	else if(code == 65 && left){
		clearInterval(left);
		left = 0;
	}
	else if(code == 68 && right){
		clearInterval(right);
		right = 0;
	}
}

var maxD = Infinity; 

// A blind man walks into a bar... and a table and a chair
function update(){
	for(var i = 0 ; i < ballArr.length ; i++){
		var maxD = Infinity;
		ballArr[i].x = ballArr[i].fx -  CL;
		ballArr[i].y = ballArr[i].fy - CT;
		if(maxD > (ballArr[i].x - W/2) * (ballArr[i].x - W/2) + (ballArr[i].y - H/2) * (ballArr[i].y - H/2)){
			maxD = (ballArr[i].x - W/2) * (ballArr[i].x - W/2) + (ballArr[i].y - H/2) * (ballArr[i].y - H/2);
			maxD += 1;
			if(maxD > 300000){
				ctx.shadowBlur = 0;
			}
			else {
				ctx.shadowBlur = Math.floor(100 - maxD / 3000);
			}
		}
	}
}

// Draw everything on canvas
function draw() {
	start();
	update();
	player.draw();
	for(var i = 0 ; i < ballArr.length ; i++){
		ballArr[i].draw();	
	}
	
}

function gameOver() {
    //cancels the animation
    cancelRequestAnimFrame(init);
}

function animloop() {
	init = requestAnimFrame(animloop);
	draw();
}

function startScreen() {
	draw();
	startBtn.draw();
}

// On button click (Restart and start)
function btnClick(e) {
	
	// Variables for storing mouse position on click
	var rect = canvas.getBoundingClientRect(),
            mx = (e.pageX + rect.left) / (rect.right-rect.left)*canvas.width,
			my = (e.pageY + rect.top) / (rect.bottom-rect.top)*canvas.height;
	
	// Click start button
	if(mx >= startBtn.x && mx <= startBtn.x + startBtn.w && my >= startBtn.y && my <= startBtn.y + startBtn.h ) {
		animloop();
		
		// Delete the start button after clicking it
		startBtn = {};
	}
	
	
}


startScreen();

