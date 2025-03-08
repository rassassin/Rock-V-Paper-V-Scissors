class Magnet {
  constructor(position) {
    this.position = position;
    this.diameter = 20;
  }

  show() {
    noStroke();
    fill(color(256, 0, 0));
    circle(this.position.x, this.position.y, this.diameter);
  }
}
