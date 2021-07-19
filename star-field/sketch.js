let stars = []
let speed;

function setup() {
  createCanvas(400, 400);
  
  for(let i = 0; i < 400; i++)
  {
    stars[i] = new Star(); 
  }
}

function draw() {
  speed = map(mouseX, 0, width, 0, 30);
  stroke(mouseX, mouseX / mouseY, mouseY);
  
  background(0);
  translate(width / 2, height / 2);
  
  for(let star of stars)
  {
    star.update();
    star.show();
  }
}