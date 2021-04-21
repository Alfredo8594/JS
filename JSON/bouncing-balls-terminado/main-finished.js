const parrafo=document.querySelector('p');
let cuenta=0;

// setup canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// Definicion del constructor de Shape

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

//Definicion de Ball heredando los atributos de Shape.
function Ball(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, velX, velY, exists);

  this.color = color;
  this.size = size;
}
Ball.prototype = Object.create(Shape.prototype);

//Definicion del constructor del prototipo de Ball.
Object.defineProperty(Ball.prototype,'constructor',
{
  value: Ball,
  enumerable: false,
  writable: true
});

/*
El costructor del prototipo de Ball, se podia definir, 
de manera mas sencilla, con la siguiente linea:
*/
//Ball.prototype.constructor = Ball;

// Definicion de EvilCircle
function EvilCircle(x, y, exists) {
  Shape.call(this, x, y, 20, 20,exists);
  
  this.color = 'white';
  this.size = 10;
}
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;


// define ball draw method

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// Definicion del metodo de dibujado del circulo diavolicote

EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};

// define ball update method

Ball.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

// Definicion del metodo para delimitar el movimiento del circulo malvavisco

EvilCircle.prototype.checkBounds = function() {
  if((this.x + this.size) >= width) {
    this.x -= this.size;
  }

  if((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  if((this.y + this.size) >= height) {
    this.y -= this.size;
  }

  if((this.y - this.size) <= 0) {
    this.y += this.size;
  }
};

//Controles del circulo malicioson

EvilCircle.prototype.setControls = function()
{
  let _this = this;
  window.onkeydown = function(e) 
  {
    if (e.key === 'a') {
      _this.x -= _this.velX;
    } else if (e.key === 'd') {
      _this.x += _this.velX;
    } else if (e.key === 'w') {
      _this.y -= _this.velY;
    } else if (e.key === 's') {
      _this.y += _this.velY;
    }
  };
};

// define ball collision detection

Ball.prototype.collisionDetect = function() {
  for(let i = 0; i < balls.length; i++) {
    if(!(this === balls[i])) {
      let dx = this.x - balls[i].x;
      let dy = this.y - balls[i].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[i].size && balls[i].exists) {
        balls[i].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
      }
    }
  }
};

// define EvilCircle collision detection

EvilCircle.prototype.collisionDetect = function() 
{
  for(let i = 0; i < balls.length; i++) 
  {
    if( balls[i].exists ) {
      const dx = this.x - balls[i].x;
      const dy = this.y - balls[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[i].size) 
      {
        balls[i].exists = false;
        cuenta--;
        parrafo.textContent="Orbes restantes: "+cuenta;
      }
    }
  }
};


// define array to store balls and populate it

let balls = [];

while(balls.length < 25) {
  const size = random(10,20);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the adge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    true,
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
  );
  balls.push(ball);
  cuenta++;
  parrafo.textContent="Orbes restantes: "+cuenta;
}

// define loop that keeps drawing the scene constantly
let evilCircle = new EvilCircle(
  random(0,width),
  random(0,height),
  true
);
evilCircle.setControls();

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);
  
  for(let i = 0; i < balls.length; i++) {
    if(balls[i].exists)
    {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
    }
  }

  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  requestAnimationFrame(loop);
}

loop();