let entities = [];
const types = ["rock", "paper", "scissors"];
const n = 200;
let qt;

function setup() {
  createCanvas(windowWidth, windowHeight);
  qt = new QuadTree(0, 0, windowWidth, windowHeight);

  for (let i = 0; i < n; i++) {
    entities.push(new RPS(types[getRandomInt(2)], i));
  }
}

function draw() {
  qt = new QuadTree(0, 0, windowWidth, windowHeight);
  background(220);

  for (const entity of entities) {
    qt.add(entity);
  }
  for (const entity of entities) {
    entity.update(qt, entities);
  }
  qt.show();
}

const getRandomInt = (max, min = 0) => Math.floor(Math.random() * (max - min + 1)) + min;
