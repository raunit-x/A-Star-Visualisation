var size = 75;
var cols = size;
var rows = size;
var grid = new Array(cols);

var openSet = new Set([]);
var closedSet = new Set([]);
var start;
var end;
var w, h;
var done = false;
var begin = false;
var noSolution = false;
path = []
var startAgain = false;
var circles = false;
var random = true;


function toggleShape()
{
	circles = !circles;
	document.getElementById("shapeButton").innerHTML = (circles) ? "RECTANGLES" : "CIRCLES";
}

// function mousePressed()
// {
// 	var x = mouseX;
// 	var y = mouseY;
// 	console.log('pressed!');
// 	if(x < 0 || x > width || y < 0 || y > height)
// 		{
// 			console.log('out!');
// 			return;
// 		};
// 	console.log(x + ',' + y);
// 	for(var i = 0; i < cols; ++i)
// 	{
// 		for(var j = 0; j < rows; ++j)
// 		{
// 			var val = grid[i][j];
// 			if(x >= val.i * w  && x <= val.i * w + w && y >= val.j * h && y <= val.j * h + h)
// 			{
// 				grid[i][j].obstacle = true;
// 			}
// 		}
// 	}
// }


function reset()
{
	cols = size;
	rows = size;
	grid = new Array(cols);
	openSet = new Set([]);
	closedSet = new Set([]);
	start;
	end;
	done = false;
	begin = false;
	path = [];
	noSolution = false;
	startAgain = false;
}

function resetButtonFunc()
{
	reset();
	setup();
	document.getElementById("startButton").innerHTML = "START";
}

function myFunction() {
	if(startAgain)
	{
		reset();
		setup();
	}
	if(done || noSolution)
	{
		document.getElementById("startButton").innerHTML = "START AGAIN!";
	}
	else if(begin)
	{
		document.getElementById("startButton").innerHTML = "RESUME";
		begin = false;
	}
	else
	{
	  	document.getElementById("startButton").innerHTML = "STOP";
	  	console.log("CLICKED!");
	  	begin = true;
	}
}

// document.getElementById("startButton").addEventListener("onclick", myFunction);

function getPath(start, current)
{
	path.push(current);
	if(current != start)
		getPath(start, current.parent);
}

function removeFromArray(arr, index)
{
	arr.splice(index, 1);
}



function Node(i, j)
{
	this.i = i;
	this.j = j;
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.parent;
	this.neighbors = [];

	this.obstacle = false; //(!((this.i == 0 && this.j == 0) || (this.i == cols - 1 && this.j == rows - 1)) && random(1) < 0.3);
	if(random)
		this.obstacle = (!((this.i == 0 && this.j == 0) || (this.i == cols - 1 && this.j == rows - 1)) && random(1) < 0.3);
	this.addNeighbors = function(grid) {
		var i = this.i;
		var j = this.j;
		if(i >= 1)
			this.neighbors.push(grid[i - 1][j]);
		if(i <= cols - 2)
			this.neighbors.push(grid[i + 1][j]);
		if(j >= 1)
			this.neighbors.push(grid[i][j - 1]);
		if(j <= rows - 2)
			this.neighbors.push(grid[i][j + 1]);
		if(i <= cols - 2 && j <= rows - 2)
			this.neighbors.push(grid[i + 1][j + 1]);
	}

	this.mousePressed = function() {
		console.log('clicked!');
		this.obstacle = !this.obstacle;
	}

	this.show = function(color) {
		fill(color);
		if(this.obstacle)
			fill(0);
		noStroke();
		// ellipse(this.i * w + w / 2, this.j * h + h / 2, w / 2, w / 2);
		// stroke(0);
		if(!circles)
			rect(this.i * w, this.j * h, w - 1, h - 1);
		else
			ellipse(this.i * w + w / 2, this.j * h + h / 2, w / 2, w / 2);

	}
}

function setup() {
  createCanvas(850, 600);
  console.log('A*');

  w = width / cols;
  h = height / rows;


  // Making the grid
  for(var i = 0; i < cols; ++i)
  	grid[i] = new Array(rows);
  
  for(var i = 0; i < cols; ++i)
  	for(var j = 0; j < rows; ++j)
  		grid[i][j] = new Node(i, j);

  for(var i = 0; i < cols; ++i)
  	for(var j = 0; j < rows; ++j)
  		grid[i][j].addNeighbors(grid);

  // initialize
  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
  openSet.add(start);

  console.log(grid);

}

function EuclideanHeurestic(a, b)
{
	return dist(a.i, a.j, b.i, b.j);
}

function ManhattanHeuristic(a, b)
{
	return abs(a.i - b.i) + abs(a.j - b.j);
}

function draw() 
{
	if(begin)
	{
		if(openSet.size > 0 && !done)
		{
			path = [];
			var current = undefined;
			for(val of openSet)
			{
				if(current === undefined)
					current = val;
				else if(val.f < current.f)
					current = val;
			}
			if(current === end)
			{
				console.log('DONE!');
				done = true;
			}
			closedSet.add(current);
			openSet.delete(current);

			var neighbors = current.neighbors;

			for(var i = 0; i < neighbors.length; ++i)
			{
				var neighbor = neighbors[i];
				var update = false;
				if (closedSet.has(neighbor) || neighbor.obstacle)
					continue;
				var tempG = current.g + 1;
				if (openSet.has(neighbor))
				{
					if(tempG < neighbor.g)
					{
						neighbor.g = tempG;
						update = true;
					}
				}
				else
				{
					neighbor.g = tempG;
					openSet.add(neighbor);
					update = true;
				}
				if(update)
				{
					neighbor.h = ManhattanHeuristic(neighbor, end);
					neighbor.f = neighbor.g + neighbor.h;
					neighbor.parent = current;
				}
			}
			getPath(start, current);
		} 
		else 
		{
			if(!done)
			{
				// no solution
				console.log('NO solution!');
				// noLoop();
				noSolution = true;
				// myFunction();
				startAgain = true;
				document.getElementById("startButton").innerHTML = "START AGAIN!";
			}
		}
	}
	if(done)
	{
		// myFunction();
		startAgain = true;
		document.getElementById("startButton").innerHTML = "START AGAIN!";
		// done = false;
	}
	background(color(255, 255, 0));
	for(var i = 0; i < cols; ++i) 
		for(var j = 0; j < rows; ++j)
			grid[i][j].show(color(255, 255, 0));

	for(val of openSet)
		val.show(color(0, 175, 0));

	for(val of closedSet)
		val.show(color(180, 0, 0));

	for(var i = 0; i < path.length; ++i)
		path[i].show(color(0, 0, 255));

	noFill();
	stroke(color(0, 120, 120));
	beginShape();
	strokeWeight(w / 3);
	for(var i = 0; i < path.length; ++i)
	{
		vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);

	}
	endShape();
	
}














	