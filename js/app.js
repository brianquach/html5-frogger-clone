// Unit class defines the basic necessities for enemy/player sprites
var Unit = function (sprite, x, y, direction, movementX, movementY) {
  this.x = x || 0;  // x position relative to canvas
  this.y = y || 0;  // y position relative to canvas
  this.sprite = sprite;  // URL of sprite
  this.direction = direction;  // Direction of movement
  this.movementX = movementX || 0;  // Number of pixels to move left or right
  this.movementY = movementY || 0;  // Number of pixels to move up or down
};
// Draw the unit on the screen
Unit.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid
// Note enemy reqired render function inherited from Unit class
var Enemy = function(sprite) {
  Unit.call(this, sprite, 0, 0, 'right', 50, 0);
};
Enemy.prototype = Object.create(Unit.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  if (!isCollisionDetected(this.direction, this.x, '', this.movementX)) {
    this.x += (this.movementX * dt);
    console.log(this.direction);
  }
};

// Note player required render funciton inherited from Unit class
var Player = function(sprite, x, y) {
  Unit.call(this, sprite, x, y, '', 101, 86);
};
Player.prototype = Object.create(Unit.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  var isLeft = (this.direction == 'left'),
    isRight = (this.direction == 'right'),
    isUp = (this.direction == 'up'),
    isDown = (this.direction == 'down');

  if (isLeft || isRight) {
    if (!isCollisionDetected(this.direction, this.x, '', this.movementX)) {
      this.x += this.movementX * ((isLeft) ? -1 : 1);
    }
  } else if (isUp || isDown) {
    if (!isCollisionDetected(this.direction, '', this.y, this.movementY)) {
      this.y += this.movementY * ((isUp) ? -1 : 1);
    }
  }
  this.direction = '';
};

Player.prototype.handleInput = function (key) {
    this.direction = key;
};

var isCollisionDetected = function (direction, x, y, increment) {
  switch (direction) {
    case 'left':
      return (x - increment) < 0;
    case 'right':
      return (x + increment) >= 505;
    case 'up':
      return (y - increment) < 0;
    case 'down':
      return (y + increment) >= 400;
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
    allEnemies.push(new Enemy(sprites.bug));
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
