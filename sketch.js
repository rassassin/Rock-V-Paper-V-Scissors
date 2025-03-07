let entities = [];
const types = ["rock", "paper", "scissors"];
const n = 1500;
let qt;

function setup() {
  createCanvas(windowWidth, windowHeight);
  qt = new QuadTree(0, 0, windowWidth, windowHeight);

  for (let i = 0; i < n; i++) {
    entities.push(new RPS(types[getRandomInt(2)], i));
  }
}

let resetTimeout;

function draw() {
  let allSame = true;
  let lastType;
  qt.clear();
  background(220);

  for (const entity of entities) {
    qt.add(entity);
    if (allSame) {
      if (!lastType) {
        lastType = entity.type;
        continue;
      }
      if (lastType != entity.type) allSame = false;
    }
  }

  qt.purge();

  if (allSame && !resetTimeout) {
    resetTimeout = setTimeout(() => {
      for (const entity of entities) {
        entity.setType(types[getRandomInt(2)]);
      }
      clearTimeout(resetTimeout);
      resetTimeout = undefined;
    }, 15000);
  }

  for (const entity of entities) {
    entity.update(qt, entities);
  }

  qt.show();
}

const getRandomInt = (max, min = 0) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandom = (max, min = 0) => Math.random() * (max - min + 1) + min;
