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
    init,
    mouse = {},
    startBtn = {},
    restartBtn = {};

// Add mousemove and mousedown events to the canvas
canvas.addEventListener("mousemove", trackPosition, true);
canvas.addEventListener("mousedown", btnClick, true);

ctx.shadowBlur = 8;
ctx.shadowColor = "white";

// Track the position of mouse cursor
function trackPosition(e) {
	mouse.x = e.pageX + canvas.offsetleft;
	mouse.y = e.pageY + canvas.offsettop;
}

// Ball object
ball = {
	x: 50,
	y: 50, 
	r: 5,
	c: "white",
	
	// Function for drawing ball on canvas
	draw: function() {
		ctx.beginPath();
		ctx.fillStyle = this.c;
		ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		ctx.fill();
	}
};

// Start Button object
startBtn = {
	w: 150,
	h: 100,
	x: W/2 - 75,
	y: H/2 - 50,
	
	draw: function() {
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

// A blind man walks into a bar... and a table and a chair
function update(){
    ball.draw();
}

// Draw everything on canvas
function draw() {
	start();
	update();
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

