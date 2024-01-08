var game = "play";

var Dark, walk, collideIMG, jumpIMG, jumping,collide;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound,music

function preload(){
  walk = loadAnimation("dark1.png","dark3.png","dark2.png","dark4.png");
  collideIMG = loadImage("die.png");
  jumpIMG = loadImage("jump.png")
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloudy.png");
  
  tentacle = loadAnimation("tentacle1.png","tentacle2.png","tentacle3.png","tentacle4.png","tentacle5.png","tentacle6.png","tentacle7.png","tentacle8.png","tentacle9.png","tentacle10.png","tentacle11.png");
  //tentacle = loadAnimation("tentacle.gif")

  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  music=loadSound("music.mp3")
}

function setup() {
  createCanvas(600, 200);

  var message = "This is a message";
 console.log(message)
  
 Dark = createSprite(50,160,20,50);
 Dark.addImage("running", walk);
 collide.addImage("collided",collideIMG);
  
 Dark.addAnimation("jump",jumpIMG);

 Dark.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //criar grupos de obstáculos e nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  Dark.setCollider("rectangle",0,0,Dark.width,Dark.height);
  Dark.debug = false
  
  score = 0;
  music.loop();
}

function draw() {
  
  background(180);
  //exibindo pontuação
  text("Score: "+ score, 500,50);
  

  
  if(game == "play"){
    

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //pontuação
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    if(Dark.y<100){
      Dark.changeAnimation("walk",walk);
    }
    
    if(Dark.isTouching(ground)){
      Dark.changeAnimation("walk", walk);
    }

    if(keyDown("space")&& Dark.y >= 100) {
       Dark.velocityY = -12;
        jumpSound.play();
        Dark.changeAnimation("jump", jumping);
    }



    Dark.velocityY = Dark.velocityY + 0.8
  
    spawnClouds();
  
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(Dark)){
        //trex.velocityY = -12;
        jumpSound.play();
        game = "end";
        dieSound.play()
      
    }
  }
   else if (game == "end") {
      gameOver.visible = true;
      restart.visible = true;
     
     //mudar a animação do trex
     Dark.changeAnimation("collided", collide);
    
     
     
      ground.velocityX = 0;
      Dark.velocityY = 0
      
     
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
   Dark.collide(invisibleGround);

  if(  Dark.isTouching(invisibleGround)){
    Dark.changeAnimation("running",walk)
  }
  
  if(mousePressedOver(restart)) {
      reset();
    }

  drawSprites();
}

//           (@^@)
function reset(){
  game="play";
  gameOver.visible=false;
  restart.visible=false;
  score=0;   // (T_T)
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  Dark.changeAnimation("walk",walk)
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   obstacle.addAnimation("tentacle",tentacle)   
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    cloud.lifetime = 200;
    
    cloud.depth = Dark.depth;
    Dark.depth = Dark.depth + 1;
    
    cloudsGroup.add(cloud);
  }
}