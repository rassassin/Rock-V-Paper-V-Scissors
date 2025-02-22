const maxSpeed = 4;
const targetMap = {
  rock: "scissors",
  scissors: "paper",
  paper: "rock",
};

class RPS {
  constructor(type) {
    this.type = type;
    this.range = 100;
    this.position = createVector(random(windowWidth), random(windowHeight));
    this.diameter = 10;
    this.velocity = {
      x: (Math.random() * maxSpeed) / (Math.random() < 0.5 ? 2 : -2),
      y: (Math.random() * maxSpeed) / (Math.random() < 0.5 ? 2 : -2),
    };
  }

  show() {
    circle(this.position.x, this.position.y, this.diameter);
  }

  update(qt) {
    let found = qt
      .query({
        x: this.position.x - this.range / 2,
        y: this.position.y - this.range / 2,
        w: this.range,
        h: this.range,
      })
      .filter((entity) => entity.type == targetMap[this.type])
      .map((entity) => ({
        distance: dist(this.position.x, this.position.y, entity.x, entity.y),
        ...entity,
      }));
    found.sort((a, b) => a.distance - b.distance);
    if (found.length > 0) this.moveTo(found[0].x, found[0].y);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.x < 0) this.position.x = window.innerWidth + this.position.x;
    if (this.position.x > window.innerWidth) this.position.x -= window.innerWidth;
    if (this.position.y < 0) this.position.y = window.innerHeight + this.position.y;
    if (this.position.y > window.innerHeight) this.position.y -= window.innerHeight;
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

  convertEntity(dominantEntity, entityListToCheck) {
    let record = Infinity;
    let closest = null;
    for (let i = 0; i < entityListToCheck.length; i++) {
      const d = this.position.dist(entityListToCheck[i].position);
      if (d < record) {
        record = d;
        closest = i;
      }
    }
    if (closest === null) return;

    this.seek(entityListToCheck[closest].position);
  }

  applyForce(force) {
    this.acceleration.add(force);
    this.acceleration.limit(this.maxForce);
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
}
