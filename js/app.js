var Application = (function(global) {
  global.isDebugMode = true;  // Debug mode enables useful features to help programmer see what's going on behind the scene
  global.canvasWidth = 505;
  global.canvasHeight = 606;

  var GameObj = function (config) {
    this.hitBoxWidth = config.hitBoxWidth || 10;  // Width of GameObj's hit box
    this.hitBoxHeight = config.hitBoxHeight || 10;  // Height of GameObj's hit box
    this.hitBoxOffsetX = config.hitBoxOffsetX || 0;  // Hit Box offset x position
    this.hitBoxOffsetY = config.hitBoxOffsetY || 0;  // Hit Box offset y position
    this.x = config.x || 0;  // x position relative to canvas
    this.y = config.y || 0;  // y position relative to canvas
  };
  // Draw the GameObject on the screen
  GameObj.prototype.render = function() {
    if (this.sprite) {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // Show unit hit box for debugging purposes
    if (global.isDebugMode) {
      ctx.strokeRect(this.x+this.hitBoxOffsetX, this.y+this.hitBoxOffsetY, this.hitBoxWidth, this.hitBoxHeight);
    }
  };

  // GameEvent are invisible spots in the game that when interacted with, will trigger an event to occur
  var GameEvent = function (config) {
    GameObj.call(this, config);

    this.name = config.name || '';
    triggerEvents
    var triggerEvents = {};
    config.triggerEvents.forEach(function(evt) {
      if (evt.trigger) {
        triggerEvents[evt.trigger] = evt.respFunc;
      }
    });
    this.triggerEvents = triggerEvents;
  };
  GameEvent.prototype = Object.create(GameObj.prototype);
  GameEvent.prototype.constructor = GameEvent;

  // Checks to see if there is an event for a trigger, then executes if found
  GameEvent.prototype.triggerEvent = function (triggerEvent) {
    if (typeof this.triggerEvents[triggerEvent] === 'function') {
      this.triggerEvents[triggerEvent]();
    }
  };

  // Unit class defines the basic necessities for enemies/players/npcs sprites
  var Unit = function (config) {
    Object.assign(config, {
      hitBoxWidth: 70,
      hitBoxHeight: 60,
      hitBoxOffsetX: 15,
      hitBoxOffsetY: 90
    });
    GameObj.call(this, config);
    this.sprite = config.sprite;  // URL of sprite
    this.direction = config.direction;  // Direction of movement
    this.movementX = config.movementX || 0;  // Number of pixels to move left or right
    this.movementY = config.movementY || 0;  // Number of pixels to move up or down
  };
  Unit.prototype = Object.create(GameObj.prototype);
  Unit.prototype.constructor = Unit;

  // Enemies our player must avoid
  // Note enemy reqired render function inherited from Unit class
  var Enemy = function(config) {
    var speed = config.speed || 1;
    Unit.call(this, {
      sprite: config.sprite || '',
      x: config.x || 0,
      y: config.y || 0,
      direction: 'right',
      movementX: speed * 100,
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
    }
    else if (isUp || isDown) {
      if (!this.isCanvasBoundaryCollision()) {
        this.y += this.movementY * ((isUp) ? -1 : 1);
      }
    }
    this.direction = '';

    // If true player has been defeated
    if (this.anyEnemyCollisions()) {
      gameOver();
    }

    this.triggerTouchEvents();
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

  // Check for player and enemy collision
  Player.prototype.anyEnemyCollisions = function () {
    var collisionDetected = false;
    for (var i = 0; i < allEnemies.length; i++) {
      collisionDetected = this.collisionExists(allEnemies[i]);
      if (collisionDetected) {
          break;
      }
    }
    return collisionDetected;
  };

  // Trigger any events player is touching
  Player.prototype.triggerTouchEvents = function () {
    var event, triggeredEventIdx = [];
    for (var i = 0; i < allEvents.length; i++) {
      event = allEvents[i];
      if (this.collisionExists(event)) {
          event.triggerEvent('touch');
          triggeredEventIdx.push(i);
      }
    }

    // Remove events that were triggeredEventIdx
    for (i = 0; i < triggeredEventIdx.length; i++) {
      allEvents.splice(triggeredEventIdx[i], 1);
    }
  };

  Player.prototype.collisionExists = function (object) {
    var isXOverlap, isYOverlap,
      isCollisionDetected = false;
      pStartX = this.x + this.hitBoxOffsetX,
      pEndX = this.x + this.hitBoxOffsetX + this.hitBoxWidth,
      pStartY = this.y + this.hitBoxOffsetY,
      pEndY = this.y + this.hitBoxOffsetY + this.hitBoxHeight,
      oStartX = object.x + object.hitBoxOffsetX,
      oEndX = object.x + object.hitBoxOffsetX + object.hitBoxWidth,
      oStartY = object.y + object.hitBoxOffsetY,
      oEndY = object.y + object.hitBoxOffsetY + object.hitBoxHeight;

    // Check for object complete overlap of player
    isXOverlap = pStartX >= oStartX && pEndX <= oEndX;
    isYOverlap = pStartY >= oStartY && pEndY <= oEndY;
    if (isXOverlap && isYOverlap) {
      isCollisionDetected = true;
    }

    // Check for player complete overlap of object
    isXOverlap = pStartX <= oStartX && pEndX >= oStartX;
    isYOverlap = pStartY <= oStartY && pEndY >= oEndY;
    if (isXOverlap && isYOverlap) {
      isCollisionDetected = true;
    }

    // Check potential overlap on object top left hit box 'x' position
    // lower and upper bounded by player's top 'x' positions
    if (pStartX <= oStartX && pEndX >= oStartX) {
      // Check if player lower and upper bounded by object 'y' positions
      if (pStartY >= oStartY && pEndY <= oEndY) {
        isCollisionDetected = true;
      }
      // Check if object is lower and upper bounded by player 'y' positions
      else if (pStartY <= oStartY && pEndY >= oEndY) {
        isCollisionDetected = true;
      }
      // Check for top side overlap
      else if (pStartY >= oStartY && pStartY <= oEndY) {
        isCollisionDetected = true;
      }
      // Check for bottom side overlap
      else if (pEndY >= oStartY && pEndY <= oEndY) {
        isCollisionDetected = true;
      }
    }
    // Check potential overlap on object top right hit box 'x' position
    // lower and upper bounded by player's top 'x' positions
    else if (pStartX <= oEndX && pEndX >= oEndX) {
      // Check if player lower and upper bounded by object 'y' positions
      if (pStartY >= oStartY && pEndY <= oEndY) {
        isCollisionDetected = true;
      }
      // Check if object is lower and upper bounded by player 'y' positions
      else if (pStartY <= oStartY && pEndY >= oEndY) {
        isCollisionDetected = true;
      }
      // Check for top side overlap
      else if (pStartY <= oEndY && pEndY >= oEndY) {
        isCollisionDetected = true;
      }
      // Check for bottom side overlap
      if (pStartY <= oStartY && pEndY >= oStartY) {
        isCollisionDetected = true;
      }
    }
    // Check potential overlap on player bounded by object lower and upper
    // 'x' positions
    else if (pStartX >= oStartX && pEndX <= oEndX) {
      if (pStartY <= oEndY && pEndY >= oEndY) {
        isCollisionDetected = true;
      }
      else if (pStartY <= oStartY && pEndY >= oStartY) {
        isCollisionDetected = true;
      }
    }

    return isCollisionDetected;
  };

  // Now instantiate your objects.
  // Place all enemy objects in an array called allEnemies
  // Place the player object in a variable called player
  var sprites = {
    "bug": 'images/enemy-bug.png',
    "player": 'images/char-boy.png'
  };

  // Player has lost
  var gameOver = function () {
    gameInit();
  };

  // Initialize game state
  var gameInit = function () {
    var bugOffset;
    global.allEnemies = [];
    for (var i = 1; i <= 3; i++) {
      bugOffset = 22 * (i - 1);
      global.allEnemies.push(new Enemy({
        sprite: sprites.bug,
        x: -75,
        y: 62 * i + bugOffset,
        speed: getRandomInt(1, 5)
      }));
    }
    global.player = new Player('images/char-boy.png', 202, 386);
    global.allEvents = [];
    global.allEvents.push(new GameEvent({
      name: 'GameWin',
      x: 0,
      y: 0,
      hitBoxWidth: global.canvasWidth,
      hitBoxHeight: 130,
      triggerEvents: [{
        trigger: 'touch',
        respFunc: function () {
          alert('you win!');
        }
      }]
    }));
  };
  gameInit();

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

  // Code from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
})(this);
