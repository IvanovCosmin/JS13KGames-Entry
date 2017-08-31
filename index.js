var FPS = 60;

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
	startBtn = {}, up, down, left, right,
	restartBtn = {};

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isInArray(value, array) {
	return array.indexOf(value) > -1;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


//wtf is that TODO
function convertForTan(x) {
	return x;
}

//here we store the tears of the lead developer
//and the walls
var maze = [];
maze.push(new Wall(0, 0, 1000, 10));
maze.push(new Wall(1000, 0, 10, 1000));
maze.push(new Wall(0, 0, 10, 1000));
maze.push(new Wall(0, 1000, 1000, 10));


// generates a maze with width , height and number of doors in each wall (except the outer ones)
var matrix = [];
var scale = 20;

function makeWall(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.lineWidth = "5";
	ctx.strokeStyle = "white";
	ctx.moveTo(x1 + 100, y1 + 100);
	ctx.lineTo(x2 + 100, y2 + 100);
	ctx.stroke();
	console.log("something works");
}

function generator(x, y) {
	matrix[x][y] = 1;
	var arr = [1,2,3,4];
	arr = shuffle(arr);
	for (i = 0; i < 4; i++) {
		if (arr[i] === 1 && matrix[x - 1] && matrix[x - 1][y] === 0) {
			makeWall((x - 1) * scale, y * scale, x * scale, y * scale);
			return generator(x - 1, y);
		}

		if (arr[i] === 2 && matrix[x + 1] && matrix[x + 1][y] === 0) {
			makeWall((x + 1) * scale, y * scale, x * scale, y * scale);
			return generator(x + 1, y);
			
		}

		if (arr[i] === 3  && matrix[x][y - 1] === 0) {
			makeWall(x * scale, (y - 1) * scale, x * scale, y * scale);
			return generator(x, y - 1);
			
		}

		if (arr[i] === 4  && matrix[x][y + 1] === 0) {
			makeWall(x * scale, (y + 1) * scale, x  * scale, y * scale);
			return generator(x, y + 1);
		}
	}
	return 0;
}

function mazeGenerator(w, h) {
	for (var i = 0; i < h; i++) {
		matrix[i] = [];
		for (var j = 0; j < w; j++) {
			matrix[i][j] = 0;
		}
	}
	return generator(0, 0);
}



// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback) {
			return window.setTimeout(callback, 1000 / FPS);
		};
})();

window.cancelRequestAnimFrame = (function () {
	return window.cancelAnimationFrame ||
		window.webkitCancelRequestAnimationFrame ||
		window.mozCancelRequestAnimationFrame ||
		window.oCancelRequestAnimationFrame ||
		window.msCancelRequestAnimationFrame ||
		clearTimeout
})();


// Add mousemove and mousedown events to the canvas
canvas.addEventListener("mousemove", trackPosition, true);
canvas.addEventListener("mousedown", btnClick, true);
canvas.addEventListener("keydown", fixedUpdate, true);
canvas.addEventListener("keyup", stopmoving, true)

ctx.shadowBlur = 0;

// Track the position of mouse cursor
function trackPosition(e) {
	mouse.x = e.pageX + canvas.offsetleft;
	mouse.y = e.pageY + canvas.offsettop;
}


//TODO
function Creature(type, c1, ec, sc) {
	this.x = W / 2;
	this.y = H / 2;
	this.fx = getRandomInt(0, 400);
	this.fy = getRandomInt(0, 400);
	this.r = 0;
	this.ro = 0;
	this.sc = (sc || "white");
	this.c1 = (c1 || "white");
	this.ec = (ec || "red");
	this.type = (type || "player");
	this.w = (this.type === "player" ? 40 : 20);
	this.h = 1.1 * this.w;
	this.draw = function () {
		ctx.beginPath();
		ctx.shadowBlur = 150;
		ctx.shadowColor = (this.type === "player" ? this.sc : this.c1);
		if (this.r) {
			//eyes
			ctx.fillStyle = this.ec;
			ctx.fillRect(this.x + this.w / 3 - this.ro * this.w * 2 / 15, this.y - this.h * 6 / 10, this.h / 7, this.w / 5);
			ctx.fillRect(this.x + this.w * 2 / 3 - this.ro * this.w * 2 / 15, this.y - this.h * 6 / 10, this.h / 7, this.w / 5);
		}
		ctx.fillStyle = this.c1;
		//body
		ctx.fillRect(this.x, this.y, this.w, this.h);
		//head
		ctx.fillRect(this.x + this.w / 4, this.y - this.h / 2, this.h / 2, this.w / 2);
		//legs
		ctx.fillRect(this.x + this.w / 8, this.y + this.h * 1.1, this.w / 4, this.h * 1.1 / 4);
		ctx.fillRect(this.x + this.w * 5 / 8, this.y + this.h * 1.1, this.w / 4, this.h * 1.1 / 4);
		//hands
		ctx.fillRect(this.x - this.w / 4, this.y, this.w / 4, this.h * 5 / 6);
		ctx.fillRect(this.x + this.w, this.y, this.w / 4, this.h * 5 / 6);
		if (!this.r) {
			//eyes
			ctx.fillStyle = this.ec;
			ctx.fillRect(this.x + this.w / 3 - this.ro * this.w * 2 / 15, this.y - this.h * 6 / 10, this.h / 7, this.w / 5);
			ctx.fillRect(this.x + this.w * 2 / 3 - this.ro * this.w * 2 / 15, this.y - this.h * 6 / 10, this.h / 7, this.w / 5);
		}



	}
};

function Wall(x, y, w, h) {
	this.x = x;
	this.fx = x;
	this.y = y;
	this.fy = y;
	this.w = w;
	this.h = h;
	this.draw = function () {
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.shadowBlur = 0;
	}

};

var wall = new Wall(100, 100, 100, 10);


var player = new Creature();

ballArr = [];
for (var i = 0; i < 2; i++) {
	ballArr[i] = new Creature("monster", "red", "white");
	ballArr[i].x = ballArr[i].fx;
	ballArr[i].y = ballArr[i].fy;
}

// Start Button object
startBtn = {
	w: 150,
	h: 100,
	x: W / 2 - 75,
	y: H / 2 - 50,

	draw: function () {
		ctx.beginPath();
		ctx.shadowColor = "white";
		ctx.strokeStyle = "white";
		ctx.fillStyle = "white";

		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);

		ctx.font = "30px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("Start", W / 2, H / 2);
	}
};


// Function for (re)start
function start() {

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, W, H);

}

function isClear(where) {
	if (where === 'up') {
		for (var i = 0; i < maze.length; i++) {
			if (maze[i].y === H / 2 && maze[i].x <= W / 2 && maze[i].x + maze[i].w >= W / 2) {
				return 0;
			}
		}
	}
	else if (where === 'down') {
		for (var i = 0; i < maze.length; i++) {
			if (maze[i].y === H / 2 && maze[i].x <= W / 2 && maze[i].x + maze[i].w >= W / 2) {
				return 0;
			}
		}
	}
	else if (where === 'left') {
		for (var i = 0; i < maze.length; i++) {
			if (maze[i].x === W / 2 && maze[i].y <= H / 2 && maze[i].y + maze[i].h >= H / 2) {
				console.log(maze[i].x + maze[i].h);
				return 0;
			}
		}
	}
	else if (where === 'right') {
		for (var i = 0; i < maze.length; i++) {
			if (maze[i].x === W / 2 && maze[i].y <= H / 2 && maze[i].y + maze[i].h >= H / 2) {
				console.log(maze[i].x + maze[i].h);
				return 0;
			}
		}
	}
	return 1;

}

function fixedUpdate(e) {
	var code = e.keyCode;
	if (code == 87 && !up) {
		up = setInterval(function () {
			CT -= speed * isClear('up');
		}, 1000 / FPS);
		player.r = 1;
	}
	else if (code == 83 && !down) {
		down = setInterval(function () {
			CT += speed * isClear('down');
		}, 1000 / FPS);
		player.r = 0;
	}
	else if (code == 65 && !left) {
		left = setInterval(function () {
			CL -= speed * isClear('left');
		}, 1000 / FPS);
		player.ro = 1;
	}
	else if (code == 68 && !right) {
		right = setInterval(function () {
			CL += speed * isClear('right');
		}, 1000 / FPS);
		player.ro = 0;
	}
}

function stopmoving(e) {
	var code = e.keyCode;
	if (code == 87 && up) {
		clearInterval(up);
		up = 0;
	}
	else if (code == 83 && down) {
		clearInterval(down);
		down = 0;
	}
	else if (code == 65 && left) {
		clearInterval(left);
		left = 0;
	}
	else if (code == 68 && right) {
		clearInterval(right);
		right = 0;
	}
}

var maxD = Infinity;

// A blind man walks into a bar... and a table and a chair
function update() {
	/*for(var i = 0 ; i < ballArr.length ; i++){
		var maxD = Infinity;
		ballArr[i].x = ballArr[i].fx -  CL;
		ballArr[i].y = ballArr[i].fy - CT;
		if(maxD > (ballArr[i].x - W/2) * (ballArr[i].x - W/2) + (ballArr[i].y - H/2) * (ballArr[i].y - H/2)){
			maxD = (ballArr[i].x - W/2) * (ballArr[i].x - W/2) + (ballArr[i].y - H/2) * (ballArr[i].y - H/2);
			maxD += 1;
			if(maxD > 300000){
				player.sc = "white";
			}
			else {
				var yes = (Math.floor(maxD/1176)).toString(16);//magic number
				player.sc = ("#FF" + yes + yes); 
			}
		}
	}
	*/
	for (var i = 0; i < maze.length; i++) {
		maze[i].x = maze[i].fx - CL;
		maze[i].y = maze[i].fy - CT;
	}
}

// Draw everything on canvas
function draw() {
	start();
	update();
	player.draw();
	for (var i = 0; i < maze.length; i++) {
		maze[i].draw();
	}
	
	/*mazeGenerator(20, 20);
	for(i = 0 ; i < matrix.length ; i++){
		for(j = 0 ; j < matrix.length; j++)
		{
			if(matrix[i][j] === 0)
			{
				generator(i,j);
			}
		}
	}
	*/

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
	//startBtn.draw();
}

// On button click (Restart and start)
function btnClick(e) {

	// Variables for storing mouse position on click
	var rect = canvas.getBoundingClientRect(),
		mx = (e.pageX + rect.left) / (rect.right - rect.left) * canvas.width,
		my = (e.pageY + rect.top) / (rect.bottom - rect.top) * canvas.height;

	// Click start button
	if (mx >= startBtn.x && mx <= startBtn.x + startBtn.w && my >= startBtn.y && my <= startBtn.y + startBtn.h) {
		animloop();

		// Delete the start button after clicking it
		startBtn = {};
	}


}


startScreen();

