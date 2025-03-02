const maxSpeed = 4;
const targetMap = {
  rock: "scissors",
  scissors: "paper",
  paper: "rock",
};
const vision = 200;
const jiggleForce = 0.1;

class RPS {
  constructor(type, index) {
    this.type = type;
    this.range = 1000;
    this.position = createVector(random(windowWidth), random(windowHeight));
    this.diameter = 15;
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 3;
    this.velocity = createVector(Math.random() * this.maxSpeed * 2 - this.maxSpeed, Math.random() * this.maxSpeed * 2 - this.maxSpeed);
    this.targetType = targetMap[type];
    this.index = index;
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
        break;
    }
    circle(this.position.x, this.position.y, this.diameter);
    noFill();
    stroke(1);
    // circle(this.position.x, this.position.y, this.range);
    fill("white");
  }

  update(qt, entities) {
    let found = qt
      .query(this.range, this.position)
      .filter((entity) => entity.type == this.targetType)
      .map((entity) => ({
        distance: dist(this.position.x, this.position.y, entity.position.x, entity.position.y),
        ...entity,
      }));
    found.sort((a, b) => a.distance - b.distance);
    if (found.length > 0) this.moveTo(found[0].position.x, found[0].position.y);
    this.jiggle();
    this.velocity.limit(this.maxSpeed);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.x < 0) this.position.x = window.innerWidth + this.position.x;
    if (this.position.x > window.innerWidth) this.position.x -= window.innerWidth;
    if (this.position.y < 0) this.position.y = window.innerHeight + this.position.y;
    if (this.position.y > window.innerHeight) this.position.y -= window.innerHeight;
    this.convertEntity(found[0], entities);
  }

  moveTo(x, y) {
    const dx = x - this.position.x;
    const dy = y - this.position.y;
    const angle = atan2(dy, dx);

    this.velocity.x += cos(angle) * 0.8;
    this.velocity.y += sin(angle) * 0.8;

    this.velocity.x = constrain(this.velocity.x, -2, 2);
    this.velocity.y = constrain(this.velocity.y, -2, 2);
  }

  convertEntity(closest, entities) {
    if (closest && closest.distance < this.diameter) {
      entities[closest.index].type = this.type;
    }
  }

  seek(target) {
    if (!target) return;
    const desired = p5.Vector.sub(target, this.position);

    // Scale to maximum speed
    desired.setMag(this.maxSpeed);

    // Steering = Desired minus velocity
    const steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce); // Limit to maximum steering force

    this.applyForce(steer);
  }

  jiggle() {
    const num = jiggleForce * 3;
    const randomVector = createVector(random(-num, num), random(-num, num));
    this.velocity.x += randomVector.x;
    this.velocity.y += randomVector.y;
  }
}
