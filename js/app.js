// Unit class defines the basic necessities for enemy/player sprites
var Unit = function (sprite, x, y) {
  this.x = x || 0;
  this.y = y || 0;
  this.sprite = sprite;
};

// Enemies our player must avoid
var Enemy = function(sprite) {
  Unit.call(this, sprite);
};
Enemy.prototype = Object.create(Unit.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(sprite) {
  Unit.call(this, sprite);
};
Player.prototype = Object.create(Unit.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(dt) {

};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy('images/enemy-bug.png')];
var player = new Player('images/char-boy.png');


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
