# Canvas Arcade Game
Enjoy this HTML 5 Canvas game based off the classic Frogger game. Avoid the moving bugs and reach the water on the opposite side of the starting point to win the game!

[Demo Here](https://brianquach.github.io/html5-frogger-clone/).

## Table of Contents
* [How To Play](#how-to-play)
* [Customizing Game](#customizing-game)
* [Creator](#creator)
* [Copyright and License](#copyright-and-license)

## How To Play
* Clone repository: git clone https://github.com/brianquach/frontend-nanodegree-resume.git or download the zip [here](https://github.com/brianquach/udacity-nano-front-game/archive/master.zip).
* Navigate to the directory where you cloned the repo or unzipped the file to.
* Use your favorite browser to open index.html.

## Customizing Game
If you're a developer and want to customize the game by adding more enemies or creating custom event triggers you can easily do so using the examples below. All code to add enemies/events or customize player should go inside the `gameInit()` function inside `app.js`.

To add more enemies you can instantiate an Enemy object by passing it a configuration object like so:
```JavaScript
global.allEnemies = [];
global.allEnemies.push(new Enemy({
  sprite: 'images/bug.png',  // Url of image to use as enemy
  x: -75,  // X canvas position to render the enemy start position
  y: 62,  // Y canvas position to render the enemy start position
  speed: 2 // Integer value that will be multipled by 100 to set enemy movement speed
}));
```

To add more events you can instantiate an GameEvent object by passing it a configuration object like so:
```JavaScript
global.allEvents = [];
global.allEvents.push(new GameEvent({
  name: 'GameWin',  // Name of event
  x: 0,  // X canvas position to render event boundary
  y: 0,  // Y canvas position to render event boundary
  hitBoxWidth: 100,  // Width of event hit box
  hitBoxHeight: 100,  // Height of event hit box
  // List of functions that will trigger when the associated event is called
  triggerEvents: [{
    trigger: 'touch',  // Event name that will trigger the respFunc
    // respFunc will only execute when the 'touch' event is called
    respFunc: function() {
      alert('Hello, world');
    }
  }]
}));
```
__*Note:__ Currently the only game trigger event that will trigger is the 'touch' event.

## Creator

Brian Quach
* <https://github.com/brianquach>
* <http://www.bkquach.com>

## Copyright and license

Code copyright 2016 Brian Quach. Code released under [the MIT license](https://github.com/brianquach/udacity-nano-front-game/blob/master/LICENSE).
