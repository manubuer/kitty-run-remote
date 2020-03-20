window.onload = () => {
  let canvas = document.querySelector("canvas");
  let ctx = canvas.getContext("2d");

  let logo = new Image();
  logo.src = "images/kitty-run-logo-trans.png";

  ctx.drawImage(logo, 85, 50, 640, 360);

  ctx.fillStyle = "black";
  ctx.font = "10px Arial";
  ctx.fillText(
    "*This game is a dirty rip-off of Frogger. But instead of a boring frog, you can now play a cat, which is way better, right?. There are brief instructions",
    85,
    420
  );
  ctx.fillText(
    "in the panel on the right and you could just hit play, start the fun and skip this crap here. But you decided to read it, so here is the long version: You",
    85,
    430
  );
  ctx.fillText(
    "have to bring 3 cats safely to their home on the top of the screen. Avoid vehicles at all cost, they will kill the cat (super bad karma). Then there is",
    85,
    440
  );
  ctx.fillText(
    "a river, cats hate water, so use floating items to get accross. Other thing to stay clear of: Cucumbers (snakes?), dogs (loud and unpredictive,",
    85,
    450
  );
  ctx.fillText(
    "old people (they are actually pretty nice but tend to be so freaking slow and block your way). What else? There are also real snakes as well as",
    85,
    460
  );
  ctx.fillText(
    "a time counter. If it hits 0 before the cats are safe, you screwed up. And yes, cats do have 7 lifes, just don't ask. Now, play already!",
    85,
    470
  );

  document.getElementById("start-button").onclick = () => {
    buttonPush.play()
    start();
  };

  // images load & create variables

  let background = new Image();
  background.src = "images/canvas-background.png";

  let cat = new Image();
  cat.src = "images/cat-head-transp.png";

  let home = new Image();
  home.src = "images/003-home.png";

  // vehicle images

  let motorcycle = new Image();
  motorcycle.src = "images/006-bike.png";

  let car = new Image();
  car.src = "images/001-car.png";

  let bus = new Image();
  bus.src = "images/003-bus.png";

  let motorcycleFast = new Image();
  motorcycleFast.src = "images/motorcycleFast.png";

  let forklift = new Image();
  forklift.src = "images/001-forklift.png";

  let deliveryTruck = new Image();
  deliveryTruck.src = "images/002-delivery-truck.png";

  //Vehicle images

  let luft = new Image();
  luft.src = "images/008-inflatable-60.png";

  let luftLR = new Image();
  luftLR.src = "images/008-inflatable-60-lr.png";

  let box = new Image();
  box.src = "images/013-wooden-60.png";

  let wood = new Image();
  wood.src = "images/011-wood-board-60.png";

  let crocodile = new Image();
  crocodile.src = "images/021-crocodile.png";

  // humans & things

  let rentner = new Image();
  rentner.src = "images/005-walker.png";

  let rentner2 = new Image();
  rentner2.src = "images/005-walker-inverted.png"

  let dog = new Image();
  dog.src = "images/010-dog.png"

  let cucumber = new Image();
  cucumber.src = "images/016-cucumber.png";

  let snake = new Image()
  snake.src = "images/018-snake.png"

  // audio

  let music = new Audio("audio/kitty-run-music.mp3");
  music.volume = 0.4

  let meow = new Audio("audio/Cat Scream-SoundBible.com-871191563.mp3");
  meow.volume = 0.1

  let traffic = new Audio("audio/Traffic_Jam-Yo_Mama-1164700013.wav");
  traffic.volume = 0.15

  let riverSound = new Audio("audio/Stream Noise-SoundBible.com-866411702.wav");
  riverSound.volume = 0.3

  let winSound = new Audio("audio/Ta Da-SoundBible.com-1884170640.mp3")
  winSound.volume = 0.3

  let blop = new Audio("audio/Blop-Mark_DiAngelo-79054334.wav")

  let buttonPush = new Audio("audio/Button Click Off-SoundBible.com-1730098776.mp3")

  function playSoundWalk() {
    let pop = new Audio("audio/Pop.m4a");
    pop.play();
  }

  function playSoundTraffic() {

    if (player.top() <   540 && player.top() >= 330) {
      traffic.play();
    } 
    
    else {
      traffic.pause();
      traffic.currentTime = 0;
    }
  }

  function playSoundRiver() {

    if (player.top() < 240 && player.top() >= 60) {
      riverSound.play();
    } 
    
    else {
      riverSound.pause();
      riverSound.currentTime = 0;
    }
  }

  // frame counter & obstacle array

  let obstacleArray = [];
  let frameCounter = -1;

  // player object

  let player = {
    x: 420,
    y: 570,
    height: 28,
    width: 30,
    image: cat,
    lifes: 7,
    time: 90,
    catsSaved: 0,
    gameOver: false,
    gameRunning: false,

    moveUp: function() {
      if (player.y > 0) {
        player.y -= 30;
      }
      playSoundWalk();
      playSoundTraffic();
      playSoundRiver();
    },

    moveDown: function() {
      if (player.y < canvas.height - 40) {
        player.y += 30;
      }
      playSoundWalk();
      playSoundTraffic();
      playSoundRiver();
    },

    moveLeft: function() {
      if (player.x > 0) {
        player.x -= 30;
      }
      playSoundWalk();
    },

    moveRight: function() {
      if (player.x < canvas.width - 30) {
        player.x += 30;
      }
      playSoundWalk();
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
      meow.play();

      riverSound.pause()
      riverSound.currentTime = 0;

      traffic.pause()
      traffic.currentTime = 0;

      document.getElementById("lifesId").innerText = this.lifes;

      if (this.lifes > 0) {
        this.reset()
      } else {
        this.gameOver = true;
      }
    },

    reset: function() {
        this.x = 420;
        this.y = 570;
        this.gameOver = false;
    }
  };

  document.getElementById("timeId").innerText = player.time;
  document.getElementById("lifesId").innerText = player.lifes;

  // vehicle class and constructor, width 30 street, 60 river

  class Vehicle {
    constructor(posX, posY, img, speed, width) {
      this.image = img;
      this.x = posX;
      this.y = posY;
      this.speed = speed;
      this.width = width;
      this.height = 28;
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

  // home class & objects

  class Home {
    constructor(posX, posY) {
      this.x = posX;
      this.y = posY;
      this.width = 60;
      this.height = 30;
      this.img = cat;
      this.occupied = false;
    }

    left() {
      return this.x + 5;
    }

    right() {
      return this.x + this.width - 5;
    }

    top() {
      return this.y;
    }

    bottom() {
      return this.y + this.height - 5;
    }
  }

  let home1 = new Home(180, 0)
  let home2 = new Home(390, 0)
  let home3 = new Home(600, 0)

  let homesArray = [home1, home2, home3];
  

  // start function

  function start() {

    player.lifes = 7;
    player.time = 90;
    player.catsSaved = 0;
    player.gameOver = false;
    player.gameRunning = true;

    document.getElementById("timeId").innerText = player.time;
    document.getElementById("lifesId").innerText = player.lifes;

    music.play();
    music.loop = true;

    draw();

    // counter

    let counter = setInterval(interval => {

      player.time--;

      if (player.catsSaved === 3) {
        clearInterval(counter);
        gameRunning = false
      }

      if (player.time === 0 || player.lifes < 1) {
        clearInterval(counter)
        player.gameOver = true
      }

      document.getElementById("timeId").innerText = player.time;
    }, 1000);
  }

  // draw function
  function draw() {

    if (player.gameOver === true || player.time === 0) {

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 810, 600);
      ctx.font = "60px Arial";
      ctx.fillStyle = "black";
      ctx.fillText("Game Over*", 250, 300);

      ctx.font = "10px Arial";
      ctx.fillText("*You suck! - The Cats", 480, 330);

      music.pause();
      music.currentTime = 0;
      riverSound.pause()
      riverSound.currentTime = 0;
      traffic.pause()
      traffic.currentTime = 0;
    
      meow.play()

      homesArray.forEach(home => home.occupied = false)
      player.catsSaved = 0

      player.reset();
      player.gameRunning = false

      obstacleArray = []

      return;
    }

    frameCounter++;

    ctx.drawImage(background, 0, 0, 810, 600);

    ctx.drawImage(home, 180, 0, 28, 28);
    ctx.drawImage(home, 390, 0, 28, 28);
    ctx.drawImage(home, 600, 0, 28, 28);

    ctx.strokeStyle = "black";
    ctx.strokeRect(210, 0, 28, 28);
    ctx.strokeRect(420, 0, 28, 28);
    ctx.strokeRect(630, 0, 28, 28);

    player.update();


    // check if cats in homes

    homesArray.forEach(function(home) {

      if (player.crashWith(home) && home.occupied === false) {
        player.catsSaved++;
        home.occupied = true;
        blop.play();
        player.reset();
      }

      if (home.occupied === true) {
        ctx.drawImage(home.img, home.left() + 25, home.top(), 30, 30);
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

    // draw moving things (x, y, img, speed, width)
    // upper lane: 330 - 390; lower lane: 450 - 510; river: 60 - 210

    if (frameCounter % (120 + (player.catsSaved * 40)) === 0) {
      obstacleArray.push(new Vehicle(canvas.width, 60, wood, 2 + player.catsSaved, 60));
      obstacleArray.push(new Vehicle(canvas.width, 90, box, 3 - player.catsSaved, 60));
      obstacleArray.push(new Vehicle(-60, 120, luftLR, -3 - player.catsSaved, 60));
      obstacleArray.push(new Vehicle(canvas.width + 150, 150, wood, 3 - player.catsSaved, 60));
      obstacleArray.push(new Vehicle(-180, 210, luftLR, -4, 60));
    }

    if (frameCounter % (240 + (player.catsSaved * 40)) === 0) {
      obstacleArray.push(new Vehicle(canvas.width, 180, box, 2 + player.catsSaved, 60));
    }

    if (frameCounter % 60 === 0) {
      obstacleArray.push(new Vehicle(-200, 480, motorcycle, -6, 30));  
      obstacleArray.push(new Vehicle(0, 450, car, -4 - player.catsSaved, 30)); 
      obstacleArray.push(new Vehicle(canvas.width, 360, motorcycleFast, 12, 30));
      obstacleArray.push(new Vehicle(canvas.width, 330, forklift, 3 + player.catsSaved, 30)); 
    }

    if (frameCounter % 40 === 0) {
      obstacleArray.push(new Vehicle(canvas.width, 390, bus, 6 + player.catsSaved, 30));
      obstacleArray.push(new Vehicle(canvas.width + 400, 390, deliveryTruck, 6 - player.catsSaved, 30));
      obstacleArray.push(new Vehicle(canvas.width, 510, deliveryTruck, 6 + player.catsSaved, 30));
    }

    if (frameCounter % 240 === 0 && player.catsSaved > 0) {
      obstacleArray.push(new Vehicle(-100, 420, snake, -3, 30));
    }

    if (frameCounter % 480 === 0 && player.catsSaved > 0) {
      obstacleArray.push(new Vehicle(-30, 240, snake, -4, 30));
      obstacleArray.push(new Vehicle(320, 0, cucumber, 0, 30));
      obstacleArray.push(new Vehicle(480, 0, cucumber, 0, 30));
    }
      
    if (frameCounter % 900 === 0 && player.catsSaved > 1) {
      obstacleArray.push(new Vehicle(canvas.width , 30, rentner, 0.8, 30));
      obstacleArray.push(new Vehicle(420, 540, dog, 0, 30));
    }

    if (frameCounter % 120 === 0 && player.catsSaved > 1) {
      obstacleArray.push(new Vehicle(420, 540, dog, 0, 30));
      obstacleArray.push(new Vehicle(240, 300, dog, 0, 30));
    }


    // check win

    if (player.catsSaved === 3) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 810, 600);
      ctx.font = "60px Arial";
      ctx.fillStyle = "black";
      ctx.fillText("Meow, you win!*", 180, 300);

      ctx.font = "10px Arial";
      ctx.fillText("*We think your're great - The Cats", 430, 330);

      homesArray.forEach(home => home.occupied = false)

      player.gameRunning = false;
      
      music.pause()
      music.currentTime = 0;
      
      winSound.play()

      obstacleArray = []
      
      return;
    }
    window.requestAnimationFrame(draw);
  }

  // keys
  document.onkeydown = function(e) {
    if (player.gameRunning === true && e.keyCode > 36 && e.keyCode < 41) {
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
