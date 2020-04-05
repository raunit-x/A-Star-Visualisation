
var sketch1 = function(p)
{
	p.canvasBackground;
	p.drops;
	p.numDrops;
	p.i;
	p.windowResized = function()
	{
		console.log('resized');
		resizeCanvas(p.windowWidth, p.windowHeight);
	}

	p.drop = function()
	{
		this.x = p.random(p.windowWidth);
		this.y = p.random(-100, 100);
		this.ySpeed = p.random(4, 10);
		this.fall = function()
		{
			this.y += this.ySpeed;
			this.ySpeed += 0.1;
			if(this.y > p.windowHeight)
			{
				this.y = p.random(-200, 400);
				this.x = p.random(p.windowWidth);
				this.ySpeed = p.random(4, 10);
			}
		}

		this.show = function()
		{
			// p.stroke(color(138, 43, 226));
			p.stroke(color(255));
			p.line(this.x, this.y, this.x, this.y + 10);
		}
	}
	p.setup = function()
	{
		p.canvasBackground = p.createCanvas(p.windowWidth, p.windowHeight);
		p.canvasBackground.position(0, 0)
		p.canvasBackground.style('z-index', '-1');
		
		p.numDrops = 300;
		p.drops = new Array(p.numDrops);
		for(p.i = 0; p.i < p.numDrops; p.i += 1)
			p.drops[p.i] = new p.drop();

	}	

	p.draw = function()
	{
		p.background(0);
		// p.stroke(color(138, 43, 226));
		for(p.i = 0; p.i < p.numDrops; p.i += 1)
		{
			p.drops[p.i].fall();
			p.drops[p.i].show();
		}
	}
}

var myP5Background = new p5(sketch1);
