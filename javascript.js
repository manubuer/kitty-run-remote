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

  let motorcycle = new Image();
  motorcycle.src = "images/right size/006-bike.png"

  let car = new Image();
  car.src = "images/right size/001-car.png"

  let bus = new Image();
  bus.src = "images/right size/003-bus.png"

  let motorcycleFast = new Image();
  motorcycleFast.src = "images/right size/motorcycleFast.png"

  let forklift = new Image();
  forklift.src = "images/right size/001-forklift.png"

  let deliveryTruck = new Image();
  deliveryTruck.src = "images/right size/002-delivery-truck.png"

  let luft = new Image();
  luft.src = "images/right size/luft-test.png"

  let home = new Image();
  home.src = "images/right size/003-home.png"


  

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
    // lifes: 3,
    // gameOver: false,

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
        this.top() < river.bottom() 
      );
    },

    resetPlayer: function() {
      this.x = 360;
      this.y = 570;
    },

  };


  // vehicles class and cosntructor

  class Vehicles {
    constructor(posX, posY, img, speed) {
      this.image = img;
      this.x = posX;
      this.y = posY;
      this.speed = speed;
      this.height = 28
      this.width = 30
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

  class Floats {
    constructor(posX, posY, img, speed) {
      this.image = img;
      this.x = posX;
      this.y = posY;
      this.speed = speed;
      this.height = 58  
      this.width = 120
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


  // river object
  let river = {
    y: 60,
    x: 0,
    width: 810,
    height: 240,

    top() {
      return this.y
    },

    left() {
      return this.x 
    },

    right() {
      return this.width
    },

    bottom() {
      return this.height
    },
  }


  // start function
  function start() {
    draw();
  }


  // draw function
  function draw() {
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

    // home
    ctx.drawImage(home, 180, 0, 30, 30)
    ctx.drawImage(home, 390, 0, 30, 30)
    ctx.drawImage(home, 600, 0, 30, 30)
    
    ctx.strokeStyle = "black"
    ctx.strokeRect(210, 0, 30, 30)
    ctx.strokeRect(420, 0, 30, 30)
    ctx.strokeRect(630, 0, 30, 30)



    player.update();


    // obstacle array update & remove

    let removal = [];

    // obstacleArray.forEach(function(item) {
    //   if (player.crashWith(item)) {
    //     // alert("you lost");
    //     console.log("you lost")
    //   }
    //   item.update();
    //   if (item.x < 0 - item.width) {
    //     removal.push(item);
    //   }
    // });


    obstacleArray.forEach(function(item) {
  
      if (player.crashWith(item) && player.withinRiver(river)) {
        console.log("you float")
        player.x -= item.speed
        // player.update()
        // item.update()
      } 
      
      else if (player.crashWith(item) && !player.withinRiver(river)) {
        // alert("you lost");
        console.log("you die")
        // player.resetPlayer()
      }

      else if (!player.crashWith(item) && player.withinRiver(river)) {
        console.log("you drown")
        // player.resetPlayer()
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

      // // put objects on upper lane
      obstacleArray.push(new Vehicles(canvas.width, 330, forklift, 2))
      obstacleArray.push(new Vehicles(canvas.width, 390, motorcycleFast, 12))
      obstacleArray.push(new Vehicles(canvas.width, 360, bus, 6))
      obstacleArray.push(new Vehicles(canvas.width+400, 360, deliveryTruck, 6))

      // put objects on lower lane
      obstacleArray.push(new Vehicles(0, 450, car, -1));
      obstacleArray.push(new Vehicles(0, 480, motorcycle, -2));
      obstacleArray.push(new Vehicles(canvas.width, 510, deliveryTruck, 6));

      // put objects on river
      obstacleArray.push(new Floats(canvas.width, 60, luft, 2));
      obstacleArray.push(new Floats(canvas.width, 120, luft, 6));
      obstacleArray.push(new Floats(0, 180, luft, -3));
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
