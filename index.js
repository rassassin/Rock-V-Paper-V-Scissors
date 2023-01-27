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

    this.dx = 1 * dmax - 2;
    this.dy = 1 * dmax - 2;
  }
  update() {
    if (this.x < 0 || this.x > canvas.width) this.dx = -this.dx;
    if (this.y < 0 || this.y > canvas.height) this.dy = -this.dy;

    this.x += this.dx;
    this.y += this.dy;

    this.draw();
    // this.attraction();
  }
  draw() {
    view.beginPath();
    view.arc(this.x, this.y, rockPaperScissorsSize, 0, 2 * Math.PI);
    view.fillStyle = this.color;
    view.fill();
  }
  attraction() {
    const tx = game.ship.x - this.x; 
    const ty = game.ship.y - this.y;
    const angle = Math.atan2(ty, tx);
  
    this.dx = this.speed * Math.cos(angle);
    this.dy = this.speed * Math.sin(angle);
        
  
    this.x += this.dx;
    this.y += this.dy;
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


function detectCollision(r1, p1, s1) { 
  const x = Math.abs(r1.x - p1.x);  
  const y = Math.abs(p1.y - r1.y);
  const z = Math.abs(r1.x - s1.x); 
  const a = Math.abs(s1.y - r1.y);
  const b = Math.abs(p1.x - s1.x);
  const c = Math.abs(s1.y - p1.y);     
    if(x < rockPaperScissorsSize*2 && y < rockPaperScissorsSize*2){
        return true
    }
    if(z < rockPaperScissorsSize*2 && a < rockPaperScissorsSize*2){
      return true
    }
    if(b < rockPaperScissorsSize*2 && c < rockPaperScissorsSize*2){
    return true
    }
    else {
        return false
    }
}


function collisions() {
  for(let i = 0; i < rocks.length; i++){
    const r1 = rocks[i]
    for(let j = i+1; j < papers.length; j++){
      const p1 = papers[j]
      for(let k = i+1; k < scissors.length; k++){
        const s1 = scissors[k]
        if(detectCollision(r1, p1, s1)){
          //do something
        }
      }
    } 
  }
}

