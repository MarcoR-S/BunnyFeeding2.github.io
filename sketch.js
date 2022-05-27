const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var fruit,rope, rope2, rope3;
var fruit_con, fruit_con2, fruit_con3;
var BG, melancia, coelho;
var coelhoImg;
var botao,botao2,botao3, mute;
var blink, comer, triste;
var bgSound, airSound, eatSound, sadSound, cutSound
var telaH, telaW
//var balao;




function preload(){ 

  BG = loadImage("background.png");
  coelhoImg = loadImage("Rabbit-01.png");
  melancia = loadImage("melon.png");

  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png")
  comer = loadAnimation("eat_0.png","eat_1.png","eat_2.png","eat_3.png","eat_4.png")
  triste = loadAnimation("sad_1.png","sad_2.png","sad_3.png")
  

  bgSound = loadSound("sound1.mp3");
  airSound = loadSound("air.wav");
  eatSound = loadSound("eating_sound.mp3");
  sadSound = loadSound("sad.wav");
  cutSound = loadSound("rope_cut.mp3");


  blink.playing = true;
  comer.playing = true;
  comer.looping = false;
  triste.playing = true;
  triste.looping = false;
}


function setup() 
{
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    telaH = displayHeight
    telaW = displayWidth
    createCanvas(displayWidth+80,displayHeight)
  }
  else{
    telaH = windowHeight
    telaW = windowWidth
    createCanvas(windowWidth,windowHeight)
  }
  
  bgSound.play();
  bgSound.setVolume(0.5)
  frameRate(80);

  engine = Engine.create();
  world = engine.world;
  ground = new Ground(200,telaH,600,20);

  botao = createImg("cut_btn.png")
  botao.position(20,30)
  botao.size(50,50)
  botao.mouseClicked(drop);

  botao2 = createImg("cut_btn.png")
  botao2.position(330,35)
  botao2.size(50,50)
  botao2.mouseClicked(drop2);

  botao3 = createImg("cut_btn.png")
  botao3.position(360,200)
  botao3.size(50,50)
  botao3.mouseClicked(drop3);

  // balao = createImg("balloon.png")
  // balao.position(10,250)
  // balao.size(150,100)
  // balao.mouseClicked(vento);

  mute = createImg("mute.png")
  mute.position(450,20)
  mute.size(50,50)
  mute.mouseClicked(silencio)

  blink.frameDelay = 15;
  comer.frameDelay = 15;
  
  
  coelho = createSprite(170,telaH-80,100,100)
  coelho.scale = 0.2
  coelho.addAnimation("piscando",blink)
  coelho.addAnimation("hummm",comer)
  coelho.addAnimation("tristinho",triste)
  console.log(coelho.position.x)


  rope = new Rope(8,{x:40,y:30});
  rope2 = new Rope(7,{x:370,y:40});
  rope3 = new Rope(4,{x:400,y:225});

  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);



  fruit_con = new Link(rope,fruit);
  fruit_con2 = new Link(rope2,fruit);
  fruit_con3 = new Link(rope3, fruit);

  
  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  
}





function draw() 
{
  background(51);
  image(BG,0,0,displayWidth+80,displayHeight);
  
  rope.show();
  rope2.show()
  rope3.show()


  push();
  imageMode(CENTER);
  if(fruit != null){
    image(melancia,fruit.position.x,fruit.position.y,70,70);
  }
  pop();
  
  Engine.update(engine);
  ground.show();
  
  if(collide(fruit,coelho) == true){
    eatSound.play();
    coelho.changeAnimation("hummm")
  }

  if(fruit != null && fruit.position.y > 650){
    coelho.changeAnimation("tristinho")
    bgSound.stop();
    sadSound.play();  
    fruit = null;
  }

  drawSprites();
 
   
}

function drop(){
  cutSound.play();
  rope.break()
  fruit_con.detach()
  fruit_con = null;
}

function drop2(){
  cutSound.play();
  rope2.break()
  fruit_con2.detach()
  fruit_con2 = null;
}

function drop3(){
  cutSound.play();
  rope3.break()
  fruit_con3.detach()
  fruit_con3 = null;
}

function collide(corpo1,corpo2){
  if(corpo1 != null){
    var d = dist(corpo1.position.x,corpo1.position.y,corpo2.position.x,corpo2.position.y)
    if(d <= 80){
      World.remove(engine.world,fruit)
      fruit = null
      return true
    }
    else{
      return false
    }
  }
}

function vento(){
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.01,y:0})
  airSound.play();
  airSound.setVolume(0.2)
}

function silencio(){
  if(bgSound.isPlaying()){
    bgSound.stop();
  }
  else{
    bgSound.play()
  }
}