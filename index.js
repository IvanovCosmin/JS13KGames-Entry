var FPS = 60;
var imgURL = ['img/fata.png' ,'img/mersulpinguinilor.png','img/spate.png', 'img/reversed-min.png'];
var images = [];
var dict = ['fear' , 'happiness' , 'shame' , 'remorseless', 'anguish' , 'delight' , 'sadness' , 'cheer' , 'heartache' , 'contentment' ,'suffering' , 'comfort' , 'collapse' , 'wonder'];
var imgNr = imgURL.length;
// Initialize some stuff
var canvas = document.querySelector('#game'),
	ctx = canvas.getContext('2d'),
	W = canvas.width,
	H = canvas.height,
	CL = 0, //camera left and camera top , used for camera following the player , yeah im dumb
	CT = 0,
	speed = 350 / FPS,
	init,
	mouse = {},
	particles = [],
	maxWords = 10,
	maxParticles = 10,
	startBtn = {}, up, down, left, right,
	restartBtn = {},
	mainPlay = 0,
	wordIndex = 0,
	wordPlay = new Word(400 , 200 , 0 , 1 , dict[1] , 40 ),
	wordTyped = new Word(400 , 250 , 255 , 1 , '' , 40),
	timeout = 0,
	life = 3,
	currentTime,
	lastTime = 0;


ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

function magicFunc(x){ //I obtained it using linear regression, used it for getting the number of words to be displayed
	return -0.01127*x + 55.38;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isInArray(value, array) {
	return array.indexOf(value) > -1;
}

function circleCoords(x){
	var random = getRandomInt(0 , 2 * Math.PI * 100) / 100;
	return [x * 3 * Math.cos(random) + W/2 + getRandomInt(- 20 , 20) , x * 3 *  Math.sin(random) + H/2 + getRandomInt(-20 , 20) ];
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
/*maze.push(new Wall(0, 0, 1000, 10));
maze.push(new Wall(990, 0, 10, 1000));
maze.push(new Wall(0, 0, 10, 1000));
maze.push(new Wall(0, 990, 1000, 10));
*/

// generates a maze with width , height and number of doors in each wall (except the outer ones)
var matrix = [];
var scale = 120;

function makeWall(x1, y1, x2, y2) {
	//WHACHAAAUT
	//maze.push(new Wall((x1===x2) * x1 , (y2 === y1) * y1 , scale * Math.abs((x1 - x2) || (y1 - y2)) , FUCKME ));
	//I will keep that line to see the reason I cry
	if(x1 === x2)
	{
		maze.push(new Wall(x1 , Math.min(y2,y1) , 10 , Math.abs(y2 - y1) ));
	}
	else if(y2 === y1){
		maze.push(new Wall(Math.min(x1,x2) , y1 + 10 , Math.abs(x1 - x2) , 10));
	}
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


// Track the position of mouse cursor
function trackPosition(e) {
	mouse.x = e.pageX + canvas.offsetleft;
	mouse.y = e.pageY + canvas.offsettop;
}


//TODO
function Creature(type, c1, ec, sc) {
	this.x = W / 2 - scale/2;
	this.y = H / 2 - scale/2;
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
		ctx.shadowBlur = 100;
		if(this.r === 0)
		{
			ctx.drawImage(images[0],this.x,this.y , scale, scale);
		}
		else if(this.r === 1)
		{
			ctx.drawImage(images[2], this.x , this.y , scale, scale);
		}
		else if(this.r === 3)
		{
			ctx.drawImage(images[1] , this.x , this.y , scale, scale);
		}
		else if(this.r === 2)
		{
			ctx.drawImage(images[3] , this.x , this.y, scale, scale);
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
		ctx.shadowBlur = 0;
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.shadowBlur = 100;
	}

};

//0 <= c <= 255 , 0 <= alpha <= 1
function Word(x , y , alpha , c , word , size){
	this.x = x;
	this.y = y;
	this.c = c;
	this.w = word;
	this.alpha = alpha;
	this.size = size || getRandomInt(15 , 30);
	this.draw = function(){
		ctx.beginPath();
		ctx.shadowBlur = 0;
		ctx.font = this.size.toString() + "px Impact, Charcoal, sans-serif";
		ctx.fillStyle = "rgba(" + this.c.toString() +", " + (255 - this.c) + ", 0,"  + this.alpha.toString() + ")";
		ctx.textAlign = "center";
		ctx.fillText(this.w , this.x , this.y);
	}
}


var player = new Creature();

wordArr = [];
for (var i = 0; i < maxWords; i++) {

	wordArr[i] = new Word(0,0, 255 , 1 , dict[2 * getRandomInt(0, dict.length/2 - 1)]);
	var XoY = circleCoords(80);
	wordArr[i].x = XoY[0];
	wordArr[i].y = XoY[1];
}

function updateWords(){
	var count = maxWords - wordArr.length;
	//TODO
	for(var i = 0 ; i < wordArr.length; i++){
		if(wordArr[i]){
			wordArr[i].alpha -= 1/FPS/2 //damn math;
			if(wordArr[i].alpha <= 0.1){
				wordArr.splice(i,1);
				//count++
			}
		}
	}
	for(var i = 0 ; i < count ; i++){
		var XoY = circleCoords(80);
		wordArr.push(new Word(XoY[0] ,XoY[1] , 255 , 1 , dict[2 * getRandomInt(0, dict.length/2 - 1) + 1]));
	}

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

function Goal (x , y){
	this.x = x;
	this.fx = x;
	this.y = y;
	this.fy = y;
	this.draw = function(){
		ctx.shadowBlur = 0;
		ctx.beginPath();
		ctx.fillStyle = "red";
		ctx.fillRect(this.x, this.y, scale / 2 , scale / 2);
	}
}

// Function for (re)start
function start() {

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, W, H);

}

function isClear(where) {
	if (where === 'up') {
		for (var i = 0; i < maze.length; i++) {
			if ((  (H/2 - 5 * scale/12 - maze[i].y ) <= speed * 1.5) && (maze[i].y < H/2) && (maze[i].x <= W / 2) && (maze[i].x + maze[i].w >= W / 2)) {
				return 0;
			}
		}
	}
	else if (where === 'down') {
		for (var i = 0; i < maze.length; i++) {
			if ((  (maze[i].y - 0.3* scale - H/2 ) <= speed * 1.5) && (maze[i].y > H/2) && (maze[i].x <= W / 2) && (maze[i].x + maze[i].w >= W / 2)) {
				return 0;
			}
		}
	}
	else if (where === 'left') {
		for (var i = 0; i < maze.length; i++) {
			if (((W/2 - scale * 0.1 - maze[i].x - maze[i].w) <= speed * 1.5 ) && (maze[i].x < W/2) && (maze[i].y + maze[i].h) >= (H / 2 -  scale/4 ) && maze[i].y <= (H / 2 +  0.20 * scale )) {
				return 0;
			}
		}
	}
	else if (where === 'right') {
		for (var i = 0; i < maze.length; i++) {
			/*console.log("start r");
			console.log((maze[i].x - W/2 - scale/10)  <= speed * 1.5 );
			console.log((maze[i].x > W/2)); */
			if (((maze[i].x - W/2 - scale/10)  <= speed * 1.5 ) && (maze[i].x > W/2) && (maze[i].y + maze[i].h) >= (H / 2 -  scale/4 ) && maze[i].y <= (H / 2 +  0.20 * scale )) {
				return 0;
			}
		}
	}
	return 1;

}

function fixedUpdate(e) {
	if(mainPlay){
		var code = e.keyCode;
		if (code == 87 && !up) {
			up = setInterval(function () {
				CT -= speed * isClear('up');
			}, 1000 / FPS);
			clearInterval(down);
			down = 0;
			player.r = 1;
		}
		else if (code == 83 && !down) {
			down = setInterval(function () {
				CT += speed * isClear('down');
			}, 1000 / FPS);
			clearInterval(up);
			up = 0;
			player.r = 0;
		}
		else if (code == 65 && !left) {
			left = setInterval(function () {
				CL -= speed * isClear('left');
			}, 1000 / FPS);
			clearInterval(right);
			right = 0;
			player.r = 2;
		}
		else if (code == 68 && !right) {
			right = setInterval(function () {
				CL += speed * isClear('right');
			}, 1000 / FPS);
			clearInterval(left);
			left = 0;
			player.r = 3;
		}
	}
	else {
		var code = e.charCode || e.keyCode || e.which;
		console.log(code);
		if((code === 8 || code === 46) && wordTyped.w.length > 0){
		wordTyped.w = wordTyped.w.slice(0, -1);
		}
		else if(code === 13){
			wordTyped.w = '';
			if(wordTyped.w === wordPlay.w){
				dict[2 * wordIndex] = "out";
				wordPlay.w = dict[2 * ++wordIndex + 1];
				lastTime = currentTime;
			}
			else {
				wordPlay.w = dict[2 * wordIndex];
				lastTime = currentTime - 2000;
			}
		}
		else{
			var keychar = String.fromCharCode(code);
			var char = keychar.toLowerCase();
			if(char.length === 1 && char.match(/[a-z]/i)){
				wordTyped.w += char;
			}
		}

	}
}

function stopmoving(e) {
	if(mainPlay){
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
	else {

	}
}

var maxD = Infinity;



// A blind man walks into a bar... and a table and a chair
function update() {
	if(mainPlay){
		var a = goal.x - W/2;
		var b = goal.y - H/2
		maxWords = Math.max(1 , Math.min(50 , Math.floor( magicFunc(Math.sqrt(a * a + b * b))  )));
		for (var i = 0; i < maze.length; i++) {
			maze[i].x = maze[i].fx - CL;
			maze[i].y = maze[i].fy - CT;
		}
		goal.x = goal.fx - CL;
		goal.y = goal.fy - CT;
		updateWords();
	}
	else {
		if(!lastTime) {
        	lastTime = currentTime;
    	}
		if(currentTime - lastTime >= 3 * 1000){
			lastTime = currentTime;
			mainPlay = 1;
		}
	}
}

// Draw everything on canvas
function draw() {
	start();
	update();
	if(mainPlay){
		player.draw();
		goal.draw();
		for (var i = 0; i < maze.length; i++) {
			maze[i].draw();
		}
		for (var i = 0; i < wordArr.length; i++) {
			wordArr[i].draw();
		}
	}
	else {
		ctx.shadowBlur = 0;
		ctx.beginPath();
		wordPlay.draw();
		wordTyped.draw();
		
	}


}

function gameOver() {
	//cancels the animation
	cancelRequestAnimFrame(init);
}

function animloop(now) {
	init = requestAnimFrame(animloop);
	currentTime = now;
	draw();
}

var goal = new Goal (100 , 100);

function startScreen() {
	mazeGenerator(50, 50);
	for(i = 0 ; i < matrix.length ; i++){
		for(j = 0 ; j < matrix.length; j++)
		{
			if(matrix[i][j] === 0)
			{
				generator(i,j);
			}
		}
	}
	draw();
	startBtn.draw();
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
		//TODO
		setTimeout(function(){ console.log("hello"); }, 1000);
		// Delete the start button after clicking it
		startBtn = {};
	}


}

for(var i = 0; i < imgURL.length; i++) {

    /// create a new image element
    var img = new Image();

    /// element is valid so we can push that to stack
    images.push(img);

    /// set handler and url
    img.onload = onloadHandler;
    img.src = imgURL[i];

    /// if image is cached IE (surprise!) may not trigger onload
    if (img.complete) onloadHandler().bind(img);
}


function onloadHandler() {
    /// optionally: "this" contains current image just loaded
    imgNr--;
    if (imgNr === 0) startScreen();
}


