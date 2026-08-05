const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// sprites

const idle = new Image();
idle.src = "sprites/metal/idle.png";


// player

let player = {
    x: greenHill.spawn.x,
    y: greenHill.spawn.y,

    width: 40,
    height: 70,

    vx: 0,
    vy: 0,

    speed: 0.8,
    jump: -15,

    grounded:false
};


// camera

let camera = {
    x:0
};


// input

let keys={};


document.addEventListener("keydown", e=>{
    keys[e.key]=true;
});


document.addEventListener("keyup", e=>{
    keys[e.key]=false;
});



// collision

function collision(){

    player.grounded=false;


    for(let p of greenHill.platforms){

        if(
            player.x < p.x+p.w &&
            player.x+player.width > p.x &&
            player.y+player.height > p.y &&
            player.y+player.height < p.y+p.h+20 &&
            player.vy >= 0
        ){

            player.y=p.y-player.height;
            player.vy=0;
            player.grounded=true;

        }

    }

}



// update

function update(){


    if(keys["ArrowRight"])
        player.vx += player.speed;


    if(keys["ArrowLeft"])
        player.vx -= player.speed;


    player.vx*=0.85;


    if(keys[" "] && player.grounded)
        player.vy=player.jump;



    player.vy+=0.7;


    player.x+=player.vx;
    player.y+=player.vy;


    collision();



    if(player.y > canvas.height){

        player.x=greenHill.spawn.x;
        player.y=greenHill.spawn.y;

    }



    camera.x=player.x-300;


    if(camera.x<0)
        camera.x=0;

}



// draw

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);



    // sky

    ctx.fillStyle="#55c9ff";
    ctx.fillRect(0,0,canvas.width,canvas.height);



    // level

    ctx.fillStyle="#35b52a";


    for(let p of greenHill.platforms){

        ctx.fillRect(
            p.x-camera.x,
            p.y,
            p.w,
            p.h
        );

    }



    // player

    if(idle.complete){

        ctx.drawImage(
            idle,
            player.x-camera.x,
            player.y,
            60,
            90
        );

    }
    else{

        ctx.fillStyle="blue";

        ctx.fillRect(
            player.x-camera.x,
            player.y,
            player.width,
            player.height
        );

    }

}



// loop

function loop(){

    update();

    draw();

    requestAnimationFrame(loop);

}


loop();
