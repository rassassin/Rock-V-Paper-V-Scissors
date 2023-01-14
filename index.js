console.log("Starting. . . ");
const canvas = document.querySelector("canvas");
const view = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
view.fillStyle = "white";
view.strokeStyle = "white";

const rockPaperScissorsSize = 4;
const dmax = 4;

class RPS {
  constructor(type) {
    this.type = type;
    this.color =
      this.type == "r" ? "red" : this.type == "p" ? "purple" : "grey";
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.dx = Math.random() * dmax - 2;
    this.dy = Math.random() * dmax - 2;
  }
  update() {
    if (this.x < 0 || this.x > canvas.width) this.dx = -this.dx;
    if (this.y < 0 || this.y > canvas.height) this.dy = -this.dy;

    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  }
  draw() {
    view.beginPath();
    view.arc(this.x, this.y, rockPaperScissorsSize, 0, 2 * Math.PI);
    view.fillStyle = this.color;
    view.fill();
  }
}

let rocks = [];
let papers = [];
let scissors = [];

for (let i = 0; i < 30; i++) {
  rocks.push(new RPS("r"));
  papers.push(new RPS("p"));
  scissors.push(new RPS("s"));
}

function animate() {
  //collisions();
  view.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 30; i++) {
    rocks[i].update();

    papers[i].update();
    scissors[i].update();
  }
  requestAnimationFrame(animate);
}

animate();
