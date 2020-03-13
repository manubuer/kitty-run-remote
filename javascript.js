/* 

// the story
- cat needs to bring item to their human companion.
- is stuck beyond road / river which he has to cross
- not allowed to touch moving things (cars, dogs, humans, etc) 
- must cross river, needs to jump on logs, boats, other floating things
- three times succeeded? -> next level

// level harder
- more opponents
- opponents move faster
- floating things disappear
- opponents on floating things
- moving opponents bigger
- floating things smaller

*/

// ===================================

/*

// what i need

- player object 
    - maybe chose character if enough time
    - move functions
    - animations that cat jumps

- opponent object constructor
    - cars, dogs, humans

- floating things object constuctor
    - logs, boats, whatever floats


*/

// canvas
window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    console.log("start klicked");
    start();
  };

  // images load & create variables

  let canvas = document.querySelector("canvas");
  let ctx = canvas.getContext("2d");

  let cat = new Image();
  cat.src = "images/cat-head-transp.png";

  let home = new Image();
  home.src = "images/right size/003-home.png";

  // vehicles images

  let motorcycle = new Image();
  motorcycle.src = "images/right size/006-bike.png";

  let car = new Image();
  car.src = "images/right size/001-car.png";

  let bus = new Image();
  bus.src = "images/right size/003-bus.png";

  let motorcycleFast = new Image();
  motorcycleFast.src = "images/right size/motorcycleFast.png";

  let forklift = new Image();
  forklift.src = "images/right size/001-forklift.png";

  let deliveryTruck = new Image();
  deliveryTruck.src = "images/right size/002-delivery-truck.png";

  //floats images

  let luft = new Image();
  luft.src = "images/right size/008-inflatable-60.png";

  let luftLR = new Image();
  luftLR.src = "images/right size/008-inflatable-60-lr.png";

  let box = new Image();
  box.src = "images/right size/013-wooden-60.png";

  let wood = new Image();
  wood.src = "images/right size/011-wood-board-60.png";

  let crocodile = new Image();
  crocodile.src = "images/right size/021-crocodile.png";

  // frame counter & obstacle array

  let obstacleArray = [];
  let frameCounter = -1;

  // player object

  let player = {
    x: 360,
    y: 570,
    height: 28,
    width: 30,
    image: cat,
    lifes: 3,
    gameOver: false,

    moveUp: function() {
      if (player.y > 0) {
        player.y -= 30;
      }
    },

    moveDown: function() {
      if (player.y < canvas.height - 40) {
        player.y += 30;
      }
    },

    moveLeft: function() {
      if (player.x > 0) {
        player.x -= 30;
      }
    },

    moveRight: function() {
      if (player.x < canvas.width - 30) {
        player.x += 30;
      }
    },

    update: function() {
      ctx.drawImage(player.image, player.x, player.y, 30, 30);
      // ctx.strokeStyle = "red";
      // ctx.strokeRect(player.x, player.y, player.width, player.height);
    },

    top: function() {
      return this.y;
    },

    left: function() {
      return this.x;
    },

    bottom: function() {
      return this.y + this.height;
    },

    right: function() {
      return this.x + this.width;
    },

    crashWith: function(obstacle) {
      return !(
        this.bottom() < obstacle.top() ||
        this.top() > obstacle.bottom() ||
        this.right() < obstacle.left() ||
        this.left() > obstacle.right()
      );
    },

    withinRiver: function(river) {
      return (
        this.bottom() > river.top() &&
        this.top() < river.bottom() &&
        this.left() + this.width / 2 > river.left() &&
        this.right() - this.width / 2 < river.right()
      );
    },

    die: function() {

      this.lifes--;

      if (this.lifes > 0) {
        console.log(`You have ${this.lifes} lifes left`);
        this.x = 360;
        this.y = 570;
        
      } else {
        this.gameOver = true;
      }
    },

    reset: function() {
        this.x = 360;
        this.y = 570;
        this.gameOver = false;
        this.lifes = 3

    },
  };

  // vehicles class and cosntructor

  class Vehicles {
    constructor(posX, posY, img, speed) {
      this.image = img;
      this.x = posX;
      this.y = posY;
      this.speed = speed;
      this.height = 28;
      this.width = 30;
    }

    top() {
      return this.y;
    }
    left() {
      return this.x;
    }
    bottom() {
      return this.y + this.height;
    }
    right() {
      return this.x + this.width;
    }

    update() {
      ctx.drawImage(this.image, this.x, this.y);
      this.x -= this.speed;
    }
  }

  class Floats {
    constructor(posX, posY, img, speed) {
      this.image = img;
      this.x = posX;
      this.y = posY;
      this.speed = speed;
      this.height = 28;
      this.width = 60;
    }

    top() {
      return this.y;
    }
    left() {
      return this.x;
    }
    bottom() {
      return this.y + this.height;
    }
    right() {
      return this.x + this.width;
    }

    update() {
      ctx.drawImage(this.image, this.x, this.y);
      this.x -= this.speed;
    }
  }

  // river object
  let river = {
    y: 60,
    x: 0,
    width: 810,
    height: 240,

    top() {
      return this.y;
    },

    left() {
      return this.x;
    },

    right() {
      return this.width;
    },

    bottom() {
      return this.height;
    }
  };

  // start function

  function start() {
    draw();
  }

  // draw function
  function draw() {
    if (player.gameOver == false) {
      frameCounter++;

      //white background aka clear screen
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 810, 600);

      //street
      ctx.fillStyle = "black";
      ctx.fillRect(0, 330, 810, 210);

      ctx.fillStyle = "white";
      ctx.fillRect(0, 420, 810, 30);

      ctx.strokeStyle = "white";
      ctx.setLineDash([5, 15]);

      ctx.moveTo(0, 360);
      ctx.lineTo(810, 360);
      ctx.moveTo(0, 390);
      ctx.lineTo(810, 390);

      ctx.moveTo(0, 480);
      ctx.lineTo(810, 480);
      ctx.moveTo(0, 510);
      ctx.lineTo(810, 510);

      ctx.stroke();

      //river
      ctx.fillStyle = "black";
      ctx.fillRect(0, 60, 810, 180);

      // home
      ctx.drawImage(home, 180, 0, 30, 30);
      ctx.drawImage(home, 390, 0, 30, 30);
      ctx.drawImage(home, 600, 0, 30, 30);

      ctx.strokeStyle = "black";
      ctx.strokeRect(210, 0, 30, 30);
      ctx.strokeRect(420, 0, 30, 30);
      ctx.strokeRect(630, 0, 30, 30);

      player.update();

      // obstacle array update & remove

      let removal = [];
      let crahesWithAnyItem = false;

      obstacleArray.forEach(function(item) {
        if (player.crashWith(item)) {
          crahesWithAnyItem = true;
          if (player.withinRiver(river)) {
            player.x -= item.speed;
          } else {
            player.die();
          }
        }

        item.update();

        if (item.x < -300 || item.x > 1200) {
          removal.push(item);
        }
      });

      if (player.withinRiver(river)) {
        if (!crahesWithAnyItem) {
          player.die();
        }
      }

      obstacleArray = obstacleArray.filter(e => !removal.includes(e));

      player.update();

      // draw moving things

      if (frameCounter % 120 === 0) {
        console.log(obstacleArray.length);

        // on river
        obstacleArray.push(new Floats(canvas.width, 60, wood, 2));
        obstacleArray.push(new Floats(canvas.width, 90, box, 6));
        obstacleArray.push(new Floats(0, 120, luftLR, -3));
        obstacleArray.push(new Floats(-150, 120, crocodile, -3));
        obstacleArray.push(new Floats(canvas.width, 150, wood, 4));
        obstacleArray.push(new Floats(canvas.width, 180, box, 3));
        obstacleArray.push(new Floats(0, 210, luftLR, -5));

        // on upper lane
        obstacleArray.push(new Vehicles(canvas.width, 330, forklift, 2));
        obstacleArray.push(new Vehicles(canvas.width, 390, motorcycleFast, 12));
        obstacleArray.push(new Vehicles(canvas.width, 360, bus, 6));
        obstacleArray.push(new Vehicles(canvas.width + 400, 360, deliveryTruck, 6)
        );

        // on lower lane
        obstacleArray.push(new Vehicles(0, 450, car, -5));
        obstacleArray.push(new Vehicles(0, 480, motorcycle, -3));
        obstacleArray.push(new Vehicles(canvas.width, 510, deliveryTruck, 6));
      }

      setTimeout(function() {
        window.requestAnimationFrame(draw);
      }, 1000 / 24);
    } 
    
    // game over screen
    else {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 810, 600);
      ctx.font = "60px Arial"
      ctx.fillStyle = "black"
      ctx.fillText("Game Over", 250, 300)

      player.reset()
    }


    // keys
    document.onkeydown = function(e) {
      switch (e.keyCode) {
        case 37:
          player.moveLeft();
          break;
        case 38:
          player.moveUp();
          break;
        case 39:
          player.moveRight();
          break;
        case 40:
          player.moveDown();
          break;
      }
    };
  }
};
