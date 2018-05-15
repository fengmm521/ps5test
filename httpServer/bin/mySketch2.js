//Pierre MARZIN 23/09/2017
//this is just a simple version of the Klotsky game, l'âne rouge in french.
//I was focusing on the mouse driven moves. If a piece has one movement possible,
//it should go wherever you "touch it". When it has more freedom, 
//it has to move according to where it's been touched...
//
var cote=150;
var margin=5;
var dcote=cote/2;
var pieces=[];
var palette=['#000000', '#FF0000', '#FF8800', '#FFFF00'];
var places=[];
var ncoups=0;
var won=false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  textSize(32);
  textAlign(CENTER);
  for (var i=0; i<6; i++) {
    places[i]=[];
    for (var j=0; j<7; j++) {
      if ((i>0&&i<5)&&(j>0&&j<6))places[i][j]=true;//free place
      else places[i][j]=false;
    }
  }
  places[2][6]=true;
  places[3][6]=true;
  pieces.push(new Piece(1, 1, 0, 4, 0));
  pieces.push(new Piece(1, 1, 3, 4, 0));
  pieces.push(new Piece(1, 1, 1, 3, 0));
  pieces.push(new Piece(1, 1, 2, 3, 0));
  pieces.push(new Piece(2, 1, 1, 2, 1));
  pieces.push(new Piece(1, 2, 0, 0, 2));
  pieces.push(new Piece(1, 2, 3, 0, 2));
  pieces.push(new Piece(1, 2, 0, 2, 2));
  pieces.push(new Piece(1, 2, 3, 2, 2));
  pieces.push(new Piece(2, 2, 1, 0, 3));
}

function draw() {
  background(128);
  fill(255);
  strokeWeight(5);
  line(width/2-2*cote-margin, height/2-2.5*cote-margin, width/2+2*cote+margin, height/2-2.5*cote-margin);
  line(width/2+2*cote+margin, height/2-2.5*cote-margin, width/2+2*cote+margin, height/2+2.5*cote+margin);
  line(width/2+2*cote+margin, height/2+2.5*cote+margin, width/2+cote+margin, height/2+2.5*cote+margin);
  line(width/2-cote-margin, height/2+2.5*cote+margin, width/2-2*cote-margin, height/2+2.5*cote+margin);
  line(width/2-2*cote-margin, height/2+2.5*cote+margin, width/2-2*cote-margin, height/2-2.5*cote-margin);
  strokeWeight(1);
  for (var i=0; i<10; i++) {
    pieces[i].display();
  }
  fill(0);
  if(won)text("You win in "+ncoups+" moves!",width/2,50);
  else text(ncoups+" move"+((ncoups<2)?"":"s"),width/2,50);
  //showplaces();
}
function showplaces() {

  for (var i=0; i<6; i++) {
    for (var j=0; j<7; j++) {
      if (places[i][j]) {
        fill(0, 0, 255);
        ellipse(width/2-2*cote+(i-1)*cote+dcote, height/2-2.5*cote+(j-1)*cote+dcote, 5, 5);
      } else {
        fill(255, 0, 0);
        ellipse(width/2-2*cote+(i-1)*cote+dcote, height/2-2.5*cote+(j-1)*cote+dcote, 5, 5);
      }
    }
  }
}
function mousePressed() {
  for (var i=0; i<10; i++) {
    pieces[i].checkprise();
  }
}
function Piece(nh, nv, xint, yint, col) {
  this.col=palette[col];
  this.nv=nv;
  this.nh=nh;
  this.rfree=this.lfree=this.ufree=this.dfree=false;
  this.freedom=0;
  this.move=createVector(0, 0, 0);
  this.xint=xint;
  this.yint=yint;
  this.x=width/2-2*cote+this.xint*cote+dcote*this.nh;
  this.y=height/2-2.5*cote+this.yint*cote+dcote*this.nv;
  this.w=this.nh*cote-2*margin;
  this.h=this.nv*cote-2*margin;
  for (var i=0; i<nh; i++) {
    for (var j=0; j<nv; j++) {
      places[xint+i+1][yint+j+1]=false;//free place
    }
  }
}
Piece.prototype.checkprise=function() {
  if (mouseX>this.x-this.w/2 &&mouseX<this.x+this.w/2&&mouseY>this.y-this.h/2 &&mouseY<this.y+this.h/2&&this.move.z==0) {
    var freeplaces=0;
    for (var i=0; i<this.nv; i++) {
      if (places[1+this.xint+this.nh][1+this.yint+i])freeplaces++;
    } 
    if (freeplaces==this.nv) {
      this.rfree=true;
      this.freedom++;
    }
    freeplaces=0;
    for (var i=0; i<this.nv; i++) {
      if (places[this.xint][1+this.yint+i])freeplaces++;
    }
    if (freeplaces==this.nv) {
      this.lfree=true;
      this.freedom++;
    }
    freeplaces=0;
    for (var i=0; i<this.nh; i++) {
      if (places[1+this.xint+i][1+this.yint+this.nv]) {        
        freeplaces++;
      }
    }
    if (freeplaces==this.nh) {
      this.dfree=true;
      this.freedom++;
    }
    freeplaces=0;
    for (var i=0; i<this.nh; i++) {
      if (places[1+this.xint+i][this.yint])freeplaces++;
    }
    if (freeplaces==this.nh) {
      this.ufree=true;
      this.freedom++;
    }
    var dr=abs(mouseX-(this.x+this.w/2));
    var dl=abs(mouseX-(this.x-this.w/2));
    var dd=abs(mouseY-(this.y+this.h/2));
    var du=abs(mouseY-(this.y-this.h/2));
    if (this.freedom==1) {
      if (this.rfree)this.moveright();
      else if (this.lfree)this.moveleft();
      else if (this.ufree)this.moveup();
      else if (this.dfree)this.movedown();
    } else if (this.freedom==2) {
      if (this.rfree&&this.lfree) {
        if (mouseX>this.x)this.moveright();
        else this.moveleft();
      } else if (this.dfree&&this.ufree) {
        if (mouseY>this.y)this.movedown();
        else this.moveup();
      } else if (this.rfree&&this.dfree) {
        if (dr>dd)this.movedown();
        else this.moveright();
      } else if (this.rfree&&this.ufree) {
        if (dr>du)this.moveup();
        else this.moveright();
      } else if (this.lfree&&this.dfree) {
        if (dl>dd)this.movedown();
        else this.moveleft();
      } else if (this.lfree&&this.ufree) {
        if (dl>du)this.moveup();
        else this.moveleft();
      }
    } else if (this.freedom==3) {
      switch(min(this.rfree?dr:1000, this.lfree?dl:1000, this.dfree?dd:1000, this.ufree?du:1000)) {
      case dr:
        this.moveright();
        break;
      case dl:
        this.moveleft();
        break;
      case dd:
        this.movedown();
        break;
      case du:
        this.moveup();
        break;
      }
    }
    this.rfree=this.lfree=this.ufree=this.dfree=false;
    this.freedom=0;
  }
}
Piece.prototype.moveright=function() {
  for (var i=0; i<this.nv; i++) {
    places[1+this.xint+this.nh][1+this.yint+i]=false;
    places[1+this.xint][1+this.yint+i]=true;
  }
  this.xint++;
  this.move=createVector(5, 0, width/2-2*cote+this.xint*cote+dcote*this.nh);
  ncoups++;
}
Piece.prototype.moveleft=function() {
  for (var i=0; i<this.nv; i++) {
    places[this.xint][1+this.yint+i]=false;
    places[this.xint+this.nh][1+this.yint+i]=true;
  }
  this.xint--;
  this.move=createVector(-5, 0, width/2-2*cote+this.xint*cote+dcote*this.nh);
  ncoups++;
}
Piece.prototype.movedown=function() {
  for (var i=0; i<this.nh; i++) {
    places[1+this.xint+i][1+this.yint+this.nv]=false;
    places[1+this.xint+i][1+this.yint]=true;
  }
  this.yint++;
  if(this.yint==4&&pieces.indexOf(this)==9)won=true;
  this.move=createVector(0, 5, height/2-2.5*cote+this.yint*cote+dcote*this.nv);
  ncoups++;
}
Piece.prototype.moveup=function() {
  for (var i=0; i<this.nh; i++) {
    places[1+this.xint+i][this.yint]=false;
    places[1+this.xint+i][this.yint+this.nv]=true;
  }
  this.yint--;
  this.move=createVector(0, -5, height/2-2.5*cote+this.yint*cote+dcote*this.nv);
  ncoups++;
}
Piece.prototype.display=function() {
  fill(this.col);
  if (this.move.z!=0) {
    if (this.move.x!=0) {
      this.x+=this.move.x;
      if (abs(this.x-this.move.z)<5) {
        this.x=this.move.z;
        this.move.z=0;
      }
    } else {
      this.y+=this.move.y;
      if (abs(this.y-this.move.z)<5) {
        this.y=this.move.z;
        this.move.z=0;
      }
    }
  }
  rect(this.x, this.y, this.w, this.h, 10, 10, 10, 10);
  if (pieces.indexOf(this)==9) {
    fill(0);
    if(won)text("Thanks!!!",this.x,this.y);
    else text("Get me \n outta here!",this.x,this.y);
  }
}