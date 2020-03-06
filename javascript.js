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

  let canvas = document.querySelector("canvas");
  let ctx = canvas.getContext("2d");

  let cat = new Image();
  cat.src = "images/cat-head.png";


// player object

  let player = {
    x: 360,
    y: 570,
    image: cat,

    moveUp: function() {
      if (player.y > 0) {
        player.y -= 10;
      }
    },

    moveDown: function() {
      if (player.y < canvas.height-40) {
        player.y += 10;
      }
    },

    moveLeft: function() {
      if (player.x > 0) {
        player.x -= 10;
      }
    },

    moveRight: function() {
      if (player.x < canvas.width-30) {
        player.x += 10;
      }
    },

    update: function() {
      ctx.drawImage(player.image, player.x, player.y, 30, 30);
    }
  };



  // start function

  function start() {
    draw();
  }



  // draw function

  function draw() {

    //white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 810, 600);

    //street
    ctx.fillStyle = "black";
    ctx.fillRect(0, 480, 810, 70)

    ctx.strokeStyle = "yellow";
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(0, 514);
    ctx.lineTo(810, 514);
    ctx.stroke();



    player.update();

    window.requestAnimationFrame(draw);
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
