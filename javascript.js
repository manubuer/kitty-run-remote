

window.onload = () => {
  let canvas = document.querySelector("canvas");
  let ctx = canvas.getContext("2d");

  let logo = new Image();
  logo.src = "images/kitty-run-logo-trans.png";

  ctx.drawImage(logo, 85, 50, 640, 360);

  ctx.fillStyle = "black";
  ctx.font = "10px Arial";
  ctx.fillText(
    "*This game is a dirty rip-off of Frogger. But it has cats in it, and this fact alone should legitimize its existence. There are brief instructions in the",
    85,
    400
  );
  ctx.fillText(
    "panel on the right and you could just hit play, start the fun and skip this crap here. But you decided to read it, so here is the long version: You",
    85,
    410
  );
  ctx.fillText(
    "have to bring 3 cats safely to their home on the top of the screen. Avoid vehicles at all cost, this will kill the cat (super bad karma). Then there is",
    85,
    420
  );
  ctx.fillText(
    "a river, cats hate water, so use floating items to get accross. Other thing to stay clear of: Cucumbers (ewww snakes), toddlers (loud and unpredic-",
    85,
    430
  );
  ctx.fillText(
    "tive), old people (they are actually pretty nice but tend to beso freaking slow and block your way. What else? There are also snakes (ewww snakes)",
    85,
    440
  );
  ctx.fillText(
    "as well as a time counter. If it hits 0 before the cats are safe, you screwed up. And yes, cats do have 7 lifes, just don't ask.",
    85,
    450
  );

  document.getElementById("start-button").onclick = () => {
    start();
  };

  // images load & create variables

  let background = new Image();
  background.src = "images/canvas-background.png";

  let waves = new Image();
  waves.src = "images/wave.png";

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

  // audio 

  let step = new Audio();
  step.src = "audio/Frog.aiff"

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
    lifes: 4,
    time: 60,
    catsSaved: 0,
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

      document.getElementById("lifesId").innerText = this.lifes;

      if (this.lifes > 0) {
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
    },
  };

  document.getElementById("timeId").innerText = player.time;
  document.getElementById("lifesId").innerText = player.lifes;

  // vehicles class and constructor

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

  // homes objects

  let home1 = {
    x: 180,
    y: 0,
    width: 60,
    height: 30,
    img: cat,
    occupied: false,

    left: function() {
      return this.x + 5;
    },

    right: function() {
      return this.x + this.width - 5;
    },

    top: function() {
      return this.y;
    },

    bottom: function() {
      return this.y + this.height - 5;
    }
  };

  let home2 = {
    x: 390,
    y: 0,
    width: 60,
    height: 30,
    img: cat,
    occupied: false,

    left: function() {
      return this.x + 5;
    },

    right: function() {
      return this.x + this.width - 5;
    },

    top: function() {
      return this.y;
    },

    bottom: function() {
      return this.y + this.height - 5;
    }
  };

  let home3 = {
    x: 600,
    y: 0,
    width: 60,
    height: 30,
    img: cat,
    occupied: false,

    left: function() {
      return this.x + 5;
    },

    right: function() {
      return this.x + this.width - 5;
    },

    top: function() {
      return this.y;
    },

    bottom: function() {
      return this.y + this.height - 5;
    }
  };

  // start function

  function start() {
    
    draw();

  // counter

    let counter = setInterval(interval => {
      player.time--;
      if (player.time <= 0 || player.lifes === 0 || player.catsSaved === 3) {
        clearInterval(counter);
      }
      document.getElementById("timeId").innerText = player.time;
    }, 1000);
  }

  // draw function
  function draw() {

    if (player.gameOver == false) {

      frameCounter++;

      ctx.drawImage(background, 0, 0, 810, 600);
      ctx.drawImage(waves, 20, 70, 32, 32);

      ctx.drawImage(home, 180, 0, 28, 28);
      ctx.drawImage(home, 390, 0, 28, 28);
      ctx.drawImage(home, 600, 0, 28, 28);

      ctx.strokeStyle = "black";
      ctx.strokeRect(210, 0, 28, 28);
      ctx.strokeRect(420, 0, 28, 28);
      ctx.strokeRect(630, 0, 28, 28);

      if (home1.occupied === true) {
        ctx.drawImage(home1.img, home1.left() + 25, home1.top(), 30, 30);
      }

      if (home2.occupied === true) {
        ctx.drawImage(home2.img, home2.left() + 25, home2.top(), 30, 30);
      }

      if (home3.occupied === true) {
        ctx.drawImage(home3.img, home3.left() + 25, home3.top(), 30, 30);
      }

      player.update();

      // at home

      let homesArray = [home1, home2, home3];

      homesArray.forEach(function(home) {
        if (player.crashWith(home) && home.occupied === false) {
          player.catsSaved++;
          home.occupied = true;
          player.reset();
        }
      });


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

        // on river
        obstacleArray.push(new Floats(canvas.width, 60, wood, 2));
        obstacleArray.push(new Floats(canvas.width, 90, box, 6));
        obstacleArray.push(new Floats(0, 120, luftLR, -3));
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

      // setTimeout(function() {
      window.requestAnimationFrame(draw);
      // }, 1000 / 24);
    }

    // game over
    else {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 810, 600);
      ctx.font = "60px Arial";
      ctx.fillStyle = "black";
      ctx.fillText("Game Over*", 250, 300);

      ctx.font = "10px Arial";
      ctx.fillText("*You suck! - The Cats", 480, 330);

      player.reset();
    }

    // game win
    if (player.catsSaved === 3) {

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 810, 600);
      ctx.font = "60px Arial";
      ctx.fillStyle = "black";
      ctx.fillText("Meow, you win!*", 180, 300);

      ctx.font = "10px Arial";
      ctx.fillText("*We think your're great - The Cats", 430, 330);
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
