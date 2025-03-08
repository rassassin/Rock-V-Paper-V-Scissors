const maxSpeed = 2;
const targetMap = {
  rock: "scissors",
  scissors: "paper",
  paper: "rock",
};
const vision = 200;
let jiggleForce;

class RPS {
  constructor(type, index, diameter = 15, position, range = 150) {
    this.type = type;
    this.range = range;
    this.position = position ?? createVector(random(windowWidth), random(windowHeight));
    this.diameter = diameter;
    this.acceleration = createVector(0, 0);
    this.maxSpeed = maxSpeed;
    this.velocity = createVector(getRandom(this.maxSpeed, -this.maxSpeed), getRandom(this.maxSpeed, -this.maxSpeed));
    this.targetType = targetMap[type];
    this.index = index;
    this.jiggleForce = this.type === "magnet" ? (jiggleForce = 10) : (jiggleForce = 0.1);
  }

  show() {
    switch (this.type) {
      case "rock":
        fill("red");
        break;
      case "paper":
        fill("purple");
        break;
      case "scissors":
        fill("green");
        break;
      default:
        fill("black");
        break;
    }
    circle(this.position.x, this.position.y, this.diameter);
    noFill();
    stroke(1);
    fill("white");
  }

  update(qt, entities) {
    let found = qt.query(this.range, this.position).map((entity) => ({
      distance: dist(this.position.x, this.position.y, entity.position.x, entity.position.y),
      ...entity,
    }));
    found.sort((a, b) => a.distance - b.distance);
    const targets = found.filter((entity) => entity.type == this.targetType || entity.type == "magnet");
    const ops = found.filter((entity) => entity.targetType == this.type);
    if (targets.length > 0) this.moveTo(targets[0].position.x, targets[0].position.y);
    else if (ops.length > 0) {
      this.moveAway(ops[0].position.x, ops[0].position.y);
      // this.jiggle(0.2);
    }
    this.jiggle(this.jiggleForce);
    this.velocity.limit(this.maxSpeed);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.x < 0) this.position.x = window.innerWidth + this.position.x;
    if (this.position.x > window.innerWidth) this.position.x -= window.innerWidth;
    if (this.position.y < 0) this.position.y = window.innerHeight + this.position.y;
    if (this.position.y > window.innerHeight) this.position.y -= window.innerHeight;
    this.convertEntity(targets[0], entities);
  }

  moveTo(x, y) {
    const dx = x - this.position.x;
    const dy = y - this.position.y;

    const desired = createVector(dx, dy);
    desired.setMag(this.maxSpeed);

    const steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxSpeed / 20); // Limit to maximum steering force
    this.velocity.add(steer);
    this.velocity.limit(this.maxSpeed);
  }

  moveAway(x, y) {
    const dx = this.position.x - x;
    const dy = this.position.y - y;

    const desired = createVector(dx, dy);
    desired.setMag(this.maxSpeed);

    const steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxSpeed / 20); // Limit to maximum steering force
    this.velocity.add(steer);
    this.velocity.limit(this.maxSpeed);
  }

  convertEntity(closest, entities) {
    if (closest && closest.distance < this.diameter) {
      entities[closest.index]?.setType(this.type);
    }
  }

  jiggle(jiggleForce) {
    const num = jiggleForce * 3;
    const randomVector = createVector(random(-num, num), random(-num, num));
    this.velocity.x += randomVector.x;
    this.velocity.y += randomVector.y;
  }

  setType(type) {
    this.type = type;
    this.targetType = targetMap[type];
  }
}
