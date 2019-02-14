var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};


// inheritance 
function Ryu(game, spritesheet) {
	//spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale
    this.animation = new Animation(spritesheet, 134/5, 45, 5, 0.10, 5, true, 3.0);
    this.speed = 0;
    this.ctx = game.ctx;
	this.move = 1;
    Entity.call(this, game, 0, 75);
}

Ryu.prototype = new Entity();
Ryu.prototype.constructor = Ryu;

Ryu.prototype.update = function () {
    this.x += this.game.clockTick * this.speed;
	var event = document.getElementById('key_arrow_or_other');
	
	if (event == 39) {
		alert(event);
		//this.animation = new Animation(AM.getAsset("./img/ryu_walking.png", 223/8, 45, 8, 0.10, 8, true, 3.0);
		this.speed = 50;
		this.move = 0;
	}
	
    if (this.x > 640) this.x = -100;
    Entity.prototype.update.call(this);
}

Ryu.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

AM.queueDownload("./img/ryu_walking.png");
AM.queueDownload("./img/ryu_standing.png");
AM.queueDownload("./img/ryu_running.png");
AM.queueDownload("./img/background.png");
AM.queueDownload("./img/ryu_crouch.png");
AM.queueDownload("./img/ryu_dash.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.png")));
	var ryu = new Ryu(gameEngine, AM.getAsset("./img/ryu_standing.png"));
    gameEngine.addEntity(ryu);
	var pressed = 0;
	var crouched = 0;
	document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 37:

            break;
        case 38:
            //alert('up');
			if (pressed == 0) {
				ryu.animation = new Animation(AM.getAsset("./img/ryu_running.png"), 255/6, 45, 6, 0.10, 6, true, 3.0);
				pressed = 1;
			}
			ryu.speed = 200;
            break;
        case 39:
            if (pressed == 0) {
				ryu.animation = new Animation(AM.getAsset("./img/ryu_walking.png"), 223/8, 45, 8, 0.10, 8, true, 3.0);
				pressed = 1;
			}
			ryu.speed = 100;
            break;
        case 40:
            if (pressed == 0) {
				ryu.animation = new Animation(AM.getAsset("./img/ryu_crouch.png"), 30, 30, 1, 0.10, 1, true, 3.0);
				pressed = 1;
				ryu.y = ryu.y + 45;
				crouched = 1;
			}
			ryu.speed = 0;
            break;
    }
};	

	document.addEventListener('keyup', function(){
		ryu.animation = new Animation(AM.getAsset("./img/ryu_standing.png"), 134/5, 45, 5, 0.10, 5, true, 3.0);
		ryu.speed = 0;
		pressed = 0;
		if (crouched == 1) {
			ryu.y = ryu.y - 45;
			crouched = 0;
		}
	});
	
    console.log("All Done!");
});