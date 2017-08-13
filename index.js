function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     ||  
		function( callback ){
			return window.setTimeout(callback, 1000 / 60);
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
	speed = 10,
    init,
    mouse = {},
    startBtn = {},up,down,left,right,
    restartBtn = {};

// Add mousemove and mousedown events to the canvas
canvas.addEventListener("mousemove", trackPosition, true);
canvas.addEventListener("mousedown", btnClick, true);
canvas.addEventListener("keydown", fixedUpdate , true);
canvas.addEventListener("keyup",stopmoving,true)

ctx.shadowBlur = 8;
ctx.shadowColor = "white";

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
	this.x = W/2,
	this.y = H/2, 
	this.r = 10,
	this.fx = getRandomInt(0 , 100);
	this.fy = getRandomInt(0 , 100);
	this.c = "green",
	this.speed =  10,
	// Function for drawing ball on canvas
	this.draw = function() {
		ctx.beginPath();
		ctx.fillStyle = this.c;
		ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		ctx.fill();
		
	}
};

ballArr = [];
for(var i = 0 ; i <= 1000 ; i++){
	ballArr[i] = new ball2();
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
		}, 1000/45);
	}
	else if(code == 83 && !down){
		down = setInterval(function(){
			CT += speed;
		}, 1000/45);
	}
	else if(code == 65 && !left){
		left = setInterval(function(){
			CL -= speed;
		}, 1000/45);
	}
	else if(code == 68 && !right){
		right = setInterval(function(){
			CL += speed;
		}, 1000/45);
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

// A blind man walks into a bar... and a table and a chair
function update(){
	for(var i = 0 ; i <= 100 ; i++){
		ballArr[i].x = ballArr[i].fx -  CL;
		ballArr[i].y = ballArr[i].fy - CT;
	}
}

// Draw everything on canvas
function draw() {
	start();
	update();
	ball.draw();
	for(var i = 0 ; i <= 100 ; i++){
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

