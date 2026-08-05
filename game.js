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


const ringSprite = new Image();
ringSprite.src = "sprites/rings/ring.gif";


// =====================
// PLAYER
// =====================

let player = {

    x: greenHill.spawn.x,
    y: greenHill.spawn.y,

    width:40,
    height:70,

    vx:0,
    vy:0,

    speed:0.8,
    maxSpeed:8,

    jumpPower:-15,

    grounded:false
};


// =====================
// GAME DATA
// =====================

let rings = 0;

let camera = {
    x:0
};


// =====================
// INPUT
// =====================

let keys={};


document.addEventListener("keydown", e=>{
    keys[e.key]=true;
});


document.addEventListener("keyup", e=>{
    keys[e.key]=false;
});


// =====================
// COLLISION
// =====================

function checkCollision(){


    player.grounded=false;


    for(let platform of greenHill.platforms){


        // landing on platforms

        if(

            player.x < platform.x + platform.w &&

            player.x + player.width > platform.x &&

            player.y + player.height > platform.y &&

            player.y + player.height < platform.y + platform.h + 20 &&

            player.vy >= 0

        ){

            player.y = platform.y - player.height;

            player.vy = 0;

            player.grounded=true;

        }

    }

}



// =====================
// RINGS
// =====================

function checkRings(){


    for(let i = greenHill.rings.length-1; i>=0; i--){


        let ring = greenHill.rings[i];


        if(

            Math.abs(player.x-ring.x)<40 &&

            Math.abs(player.y-ring.y)<60

        ){

            greenHill.rings.splice(i,1);

            rings++;


            document.getElementById("rings").innerText=rings;

        }

    }

}



// =====================
// UPDATE
// =====================

function update(){



    // movement

    if(keys["ArrowRight"])
        player.vx += player.speed;


    if(keys["ArrowLeft"])
        player.vx -= player.speed;



    // friction

    player.vx *= 0.85;



    if(player.vx > player.maxSpeed)
        player.vx = player.maxSpeed;


    if(player.vx < -player.maxSpeed)
        player.vx = -player.maxSpeed;



    // jump

    if(keys[" "] && player.grounded){

        player.vy = player.jumpPower;

        player.grounded=false;

    }



    // gravity

    player.vy += 0.7;



    player.x += player.vx;

    player.y += player.vy;



    checkCollision();

    checkRings();



    // death

    if(player.y > canvas.height){

        player.x = greenHill.spawn.x;

        player.y = greenHill.spawn.y;

        player.vx=0;

        player.vy=0;

    }



    // camera

    camera.x = player.x - 300;


    if(camera.x < 0)

        camera.x=0;


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

    ctx.fillStyle="#55c9ff";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    // platforms

    ctx.fillStyle="#35b52a";


    for(let p of greenHill.platforms){

        ctx.fillRect(

            p.x-camera.x,

            p.y,

            p.w,

            p.h

        );

    }



    // rings

    for(let ring of greenHill.rings){


        ctx.drawImage(

            ringSprite,

            ring.x-camera.x-16,

            ring.y-16,

            32,

            32

        );

    }



    // choose metal sprite

    let sprite = metalIdle;


    if(!player.grounded)

        sprite = metalJump;


    else if(Math.abs(player.vx)>1)

        sprite = metalRun;




    // draw metal sonic

    ctx.drawImage(

        sprite,

        player.x-camera.x,

        player.y,

        60,

        90

    );

}



// =====================
// LOOP
// =====================

function gameLoop(){

    update();

    draw();

    requestAnimationFrame(gameLoop);

}


gameLoop();
