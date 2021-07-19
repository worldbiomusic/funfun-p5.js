class Star
{
  constructor()
  {
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.z = random(width);
    
    this.px = this.x;
    this.py = this.y;
  }
  
  update()
  {
    this.z -= speed;
    if(this.z < 1)
    {
      this.px = this.x = random(-width, width);
      this.py = this.y = random(-height, height);
      this.z = width;
    }
  }
  
  show()
  {
    fill(255);
    noStroke();
    
    let sx = map(this.x / this.z, 0, 1, 0, width);
    let sy = map(this.y / this.z, 0, 1, 0, height);
    
    let r = map(this.z, width, 0, 0, 16);
    
    // ellipse(sx, sy, r, r); 
    
    stroke(mouseX, random(255), mouseY);
    line(this.px, this.py, sx, sy); 
    
    this.px = sx;
    this.py = sy;
  }
}