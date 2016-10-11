// Unit class defines the basic necessities for enemy/player sprites
var Unit = function (config) {
  this.x = config.x || 0;  // x position relative to canvas
  this.y = config.y || 0;  // y position relative to canvas
  this.sprite = config.sprite;  // URL of sprite
  this.direction = config.direction;  // Direction of movement
  this.movementX = config.movementX || 0;  // Number of pixels to move left or right
  this.movementY = config.movementY || 0;  // Number of pixels to move up or down
  this.hitBoxWidth = 70;  // Width of unit's hit box
  this.hitBoxHeight = 60;  // Height of unti's hit box
  this.hitBoxOffsetX = 15;  // Hit Box offset x position
  this.hitBoxOffsetY = 90;  // Hit Box offset y position
};
// Draw the unit on the screen
Unit.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  ctx.strokeRect(this.x+this.hitBoxOffsetX, this.y+this.hitBoxOffsetY, this.hitBoxWidth, this.hitBoxHeight);  // Show unit hit box for debugging purposes *comment out for production
};

// Enemies our player must avoid
// Note enemy reqired render function inherited from Unit class
var Enemy = function(sprite, x, y) {
  Unit.call(this, {
    sprite: sprite,
    x: x,
    y: y,
    direction: 'right',
    movementX: 300,
    movementY: 0
  });
};
Enemy.prototype = Object.create(Unit.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  var isLeft = this.direction == 'left';
  if (isLeft || this.direction == 'right') {
    this.x += (this.movementX * dt) * (isLeft ? -1 : 1);
  }
  // Switch direction if off canvas
  if (this.isEnemyOffCanvas()) {
    this.direction = isLeft ? 'right' : 'left';
  }
};

// Check if the enemy is off the canvas
Enemy.prototype.isEnemyOffCanvas = function () {
  switch (this.direction) {
    case 'left':
      return this.x < -120;
    case 'right':
      return this.x >= canvasWidth + 100;
  }
};

// Note player required render funciton inherited from Unit class
var Player = function(sprite, x, y) {
  Unit.call(this, {
    sprite: sprite,
    x: x,
    y: y,
    direction: '',
    movementX: 101,
    movementY: 83
  });
};
Player.prototype = Object.create(Unit.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  var isLeft = (this.direction == 'left'),
    isRight = (this.direction == 'right'),
    isUp = (this.direction == 'up'),
    isDown = (this.direction == 'down');

  if (isLeft || isRight) {
    if (!this.isCanvasBoundaryCollision()) {
      this.x += this.movementX * ((isLeft) ? -1 : 1);
    }
  } else if (isUp || isDown) {
    if (!this.isCanvasBoundaryCollision()) {
      this.y += this.movementY * ((isUp) ? -1 : 1);
    }
  }
  this.direction = '';
};

// Handles user keyboard input
Player.prototype.handleInput = function (key) {
    this.direction = key;
};

// Check if the player is trying to move off the canvas boundaries
Player.prototype.isCanvasBoundaryCollision = function () {
  switch (this.direction) {
    case 'left':
      return (this.x - this.movementX) < 0;
    case 'right':
      return (this.x + this.movementX) >= canvasWidth;
    case 'up':
      return (this.y - this.movementY) < -29;
    case 'down':
      return (this.y + this.movementY) >= canvasHeight - 200;
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var sprites = {
  "bug": 'images/enemy-bug.png',
  "player": 'images/char-boy.png'
};

var allEnemies = [];
for (var i = 0; i < 3; i++) {
    allEnemies.push(new Enemy(sprites.bug, -50, 62));
}
var player = new Player('images/char-boy.png', 202, 386);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
