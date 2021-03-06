import { MovingDirection } from './utils.js';
import { tileSize } from './constants.js';
import { map1, map2 } from './map.js';

import { Dots } from './items/Dots.js';
import { BigDots } from './items/BigDots.js';
import { Pacman, FacingDirection } from './items/Pacman.js';
import { Ghost } from './items/Ghost.js';
import { Title } from './items/Title.js';

window.canvas = document.querySelector('canvas');
window.ctx = window.canvas.getContext('2d');

const selectedMap = new URLSearchParams(window.location.search).get('map');

const maps = {
  map1: map1,
  map2: map2,
};

const currentMap = maps[selectedMap];
let gameRunning = false;

// Items
const dots = new Dots(currentMap, currentMap.getItems(0));
const bigDots = new BigDots(currentMap, currentMap.getItems(4));
const pacman = new Pacman(currentMap.getItems(2)[0], 0.1, currentMap);
const ghost1 = new Ghost(
  pacman,
  currentMap,
  'red.png',
  currentMap.getItems(3)[0],
  0.1,
);
const ghost2 = new Ghost(
  pacman,
  currentMap,
  'cyan.png',
  currentMap.getItems(3)[1],
  0.1,
);
const ghost3 = new Ghost(
  pacman,
  currentMap,
  'orange.png',
  currentMap.getItems(3)[2],
  0.1,
);
const ghost4 = new Ghost(
  pacman,
  currentMap,
  'pink.png',
  currentMap.getItems(3)[3],
  0.1,
);
const title = new Title('Pacman');

window.canvas.width = currentMap.width;
window.canvas.height = currentMap.height;

window.addEventListener('keydown', (e) => {
  e.preventDefault();
  switch (e.keyCode) {
    // Up
    case 87:
      if (pacman.currentMovingDirection === MovingDirection.DOWN)
        pacman.currentMovingDirection = MovingDirection.UP;
      pacman.requestedMovingDirection = MovingDirection.UP;
      break;

    // Right
    case 68:
      if (pacman.currentMovingDirection === MovingDirection.LEFT)
        pacman.currentMovingDirection = MovingDirection.RIGHT;
      pacman.requestedMovingDirection = MovingDirection.RIGHT;
      break;

    // Down
    case 83:
      if (pacman.currentMovingDirection === MovingDirection.UP)
        pacman.currentMovingDirection = MovingDirection.DOWN;
      pacman.requestedMovingDirection = MovingDirection.DOWN;
      break;

    // Left
    case 65:
      if (pacman.currentMovingDirection === MovingDirection.RIGHT)
        pacman.currentMovingDirection = MovingDirection.LEFT;
      pacman.requestedMovingDirection = MovingDirection.LEFT;
      break;

    default:
      break;
  }
});

const beginningSound = new Audio('/sounds/beginning.wav');
beginningSound.volume = 0.6;
beginningSound.play();

function start() {
  let count = 4;

  const counter = setInterval(() => {
    count--;
    title.title = `${count}`;

    if (count === 0) {
      clearInterval(counter);
      gameRunning = true;
    }
  }, 1000);
}

function render() {
  window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);

  const livebar = document.querySelector('#livebar');
  const liveHTML = '<div class="live"></div>';
  if (pacman.lives >= 0) {
    livebar.innerHTML = liveHTML.repeat(pacman.lives);
  }

  if (pacman.lives === 0) {
    document.querySelector('#return').style.display = 'block';
    document.querySelector('#replay').style.display = 'block';
    title.title = 'Game Over';
    gameRunning = false;
  }

  currentMap.draw();
  dots.draw();
  bigDots.draw();

  if (gameRunning) {
    ghost1.draw();
    ghost2.draw();
    ghost3.draw();
    ghost4.draw();
    pacman.draw();
  } else {
    title.draw();
  }

  if (dots.coordinates.length === 0) {
    dots.reset();
    bigDots.reset();
  }

  requestAnimationFrame(render);
}

start();
render();
