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

  let rocks = 0;
  let papers = 0;
  let scissors = 0;

  for (const entity of entities) {
    qt.add(entity);
    if (entity.type == "rock") rocks++;
    if (entity.type == "paper") papers++;
    if (entity.type == "scissors") scissors++;
    if (allSame) {
      if (!lastType) {
        lastType = entity.type;
        continue;
      }
      if (lastType != entity.type) allSame = false;
    }
  }
  showHud(rocks, papers, scissors);
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

function showHud(rocks, papers, scissors) {
  const leftPadding = 50;
  const topPadding = 50;
  const gap = 50;
  const strings = [`Rocks: ${rocks}`, `Paper: ${papers}`, `Scissors: ${scissors},`, `Total: ${n}`];
  noStroke();
  textSize(16);
  let position = leftPadding;
  for (let i = 0; i < strings.length; i++) {
    if (i === 0) fill("red");
    if (i === 1) fill("purple");
    if (i === 2) fill("green");
    if (i > 2) fill("black");
    text(strings[i], position, topPadding);
    position += textWidth(strings[i]);
    position += gap;
  }
}

const getRandomInt = (max, min = 0) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandom = (max, min = 0) => Math.random() * (max - min + 1) + min;
