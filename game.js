const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// =====================
// SPRITES
// =====================

const metalIdle = new Image();
metalIdle.src = "sprites/metal/idle.png";

const metalRun = new Image();
metalRun.src = "sprites/metal/run.png";

const metalJump = new Image();
metalJump.src = "sprites/metal/jump.png";


// =====================
// PLAYER
// =====================

let player = {

    x: greenHill.spawn.x,
    y: greenHill.spawn.y,

    // collision box
    width: 28,
    height: 48,

    vx: 0,
    vy: 0,

    speed: 0.8,
    maxSpeed: 8,

    jumpPower: -15,

    grounded: false

};


// =====================
// CAMERA
// =====================

let camera = {
    x:0
};


// =====================
// INPUT
// =====================

let keys = {};


document.addEventListener("keydown", e=>{
    keys[e.key] = true;
});


document.addEventListener("keyup", e=>{
    keys[e.key] = false;
});



// =====================
// COLLISION
// =====================

function collision(){

    player.grounded = false;


    for(let p of greenHill.platforms){


        // falling onto platform

        if(

            player.x < p.x + p.w &&
            player.x + player.width > p.x &&

            player.y + player.height > p.y &&

            player.y + player.height < p.y + p.h + 15 &&

            player.vy >= 0

        ){

            player.y = p.y - player.height;

            player.vy = 0;

            player.grounded = true;

        }

    }

}



// =====================
// UPDATE
// =====================

function update(){


    // movement

    if(keys["ArrowRight"]){
        player.vx += player.speed;
    }


    if(keys["ArrowLeft"]){
        player.vx -= player.speed;
    }



    // friction

    player.vx *= 0.85;



    // speed limit

    if(player.vx > player.maxSpeed)
        player.vx = player.maxSpeed;


    if(player.vx < -player.maxSpeed)
        player.vx = -player.maxSpeed;




    // jump

    if(keys[" "] && player.grounded){

        player.vy = player.jumpPower;

        player.grounded = false;

    }



    // gravity

    player.vy += 0.7;



    // move

    player.x += player.vx;

    player.y += player.vy;



    collision();



    // death

    if(player.y > canvas.height + 200){

        player.x = greenHill.spawn.x;
        player.y = greenHill.spawn.y;

        player.vx = 0;
        player.vy = 0;

    }



    // camera

    camera.x = player.x - 300;


    if(camera.x < 0)
        camera.x = 0;


}



// =====================
// DRAW
// =====================

function draw(){


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    // sky

    ctx.fillStyle = "#55c9ff";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    // platforms

    ctx.fillStyle = "#35b52a";


    for(let p of greenHill.platforms){

        ctx.fillRect(

            p.x - camera.x,

            p.y,

            p.w,

            p.h

        );

    }



    // choose Metal sprite

    let sprite = metalIdle;


    if(!player.grounded){

        sprite = metalJump;

    }

    else if(Math.abs(player.vx) > 1){

        sprite = metalRun;

    }




    // draw Metal Sonic correctly

    if(sprite.complete){


        let scale = 2;


        let width = sprite.width * scale;

        let height = sprite.height * scale;


        ctx.drawImage(

            sprite,

            player.x - camera.x - (width-player.width)/2,

            player.y - (height-player.height),

            width,

            height

        );

    }

    else{


        // fallback

        ctx.fillStyle="blue";

        ctx.fillRect(

            player.x-camera.x,

            player.y,

            player.width,

            player.height

        );

    }

}



// =====================
// GAME LOOP
// =====================

function gameLoop(){

    update();

    draw();

    requestAnimationFrame(gameLoop);

}


gameLoop();
