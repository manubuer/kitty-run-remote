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
  cat.src = "images/cat-head-transp.png"

  let raceCar = new Image();
  raceCar.src = "images/sportcar.png"

  let otherRaceCar = new Image();
  otherRaceCar.src = "images/sportcar-reversed.png"

  let motorcycle = new Image();
  motorcycle.src = "images/motorcycle.png"

  let gym = new Image();
  gym.src = "images/gym.png"

  let train = new Image();
  train.src = "images/train.png";

  let box = new Image();
  box.src = "images/wooden-box.png";

  let log = new Image();
  log.src = "images/firewood.png";

  let snakeWhite = new Image();
  snakeWhite.src = "images/snake1-white.png";

  // frame counter & obstacle array

  let obstacleArray = [];
  let frameCounter = -1;

  // player object

  let player = {
    x: 360,
    y: 570,
    height: 30,
    width: 34,
    image: cat,

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
      ctx.strokeStyle = "red"
      ctx.strokeRect(player.x, player.y, player.width, player.height);
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
      return this.x-1 + this.width;
    },

    crashWith: function(obstacle) {
      return !(
        this.bottom() < obstacle.top() ||
        this.top() > obstacle.bottom() ||
        this.right() < obstacle.left() ||
        this.left() > obstacle.right()
      );
    }
  };

  // vehicles class and cosntructor

  class Vehicle {
    constructor(posX, posY, img, speed) {
      this.image = img;
      this.x = posX;
      this.y = posY;
      this.speed = speed;
      this.height = 22
      this.width = 65
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
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      this.x -= this.speed;
    }
  }

  // start function

  function start() {
    draw();
  }

  // draw function

  function draw() {
    console.log("drawing")
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
    ctx.moveTo(0, 480);
    ctx.lineTo(810, 480);
    ctx.moveTo(0, 510);
    ctx.lineTo(810, 510);
    ctx.stroke();

    //river
    ctx.fillStyle = "black";
    ctx.fillRect(0, 60, 810, 180);

    player.update();


    // obstacle array update & remove

    let removal = [];

    obstacleArray.forEach(function(item) {
      if (player.crashWith(item)) {
        alert("you lost");
      }
      item.update();
      if (item.x < 0 - item.width) {
        removal.push(item);
      }
    });

    obstacleArray = obstacleArray.filter(e => !removal.includes(e))

    player.update();

    if (frameCounter % 120 === 0) {
      console.log(obstacleArray.length);

      // // put objects on upper lane ===> doesnt work, why???
      // obstacleArray.push(new Vehicle(-50, 330, gym, -2))
      obstacleArray.push(new Vehicle(-50, 364, motorcycle, -4))
      obstacleArray.push(new Vehicle(-50, 394, otherRaceCar, -6))

      // put objects on lower lane
      obstacleArray.push(new Vehicle(canvas.width, 454, raceCar, 4));
      obstacleArray.push(new Vehicle(canvas.width, 484, raceCar, 9));
      obstacleArray.push(new Vehicle(canvas.width, 514, raceCar, 6));

      // put objects on river
      // obstacleArray.push(new Vehicle(canvas.width, 45, log, 2));
      // obstacleArray.push(new Vehicle(canvas.width, 140, box, 4));
      // obstacleArray.push(new Vehicle(canvas.width, 180, snakeWhite, -1));
    }

    setTimeout(function() {
      window.requestAnimationFrame(draw);
    }, 1000 / 24);
    
  }

  // keys

  document.onkeydown = function(e) {
    switch (e.keyCode) {
      case 37:
        player.moveLeft();
        console.log("left");
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
};
