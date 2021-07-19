// let canvasSize = windowWidth;
let cellSize = 100;

let maze;
let mpg;
let mpf;
let player1;
let player2;

let manager;

let DEBUG = true;

let socket;

let name;

// DOM
let pTitle;
let nameInput;
let startBtn;
let colorButtons = [];
let selectedColor = undefined;
let infoMsg="";

let playerBoard = [];

let mazeUpdated = false;

function makeDOM() {
  pTitle = createP("MuMa");
  pTitle.position(100, 0);

  nameInput = createInput("");
  nameInput.position(100,100)

  startBtn = createButton("START");
  startBtn.position(100, 200);
  startBtn.mousePressed(enterGame);

  let redBtn = createButton("RED");
  redBtn.style("background-color", "red");

  let yellowBtn = createButton("YELLOW");
  yellowBtn.style("background-color", "yellow");

  let greenBtn = createButton("GREEN");
  greenBtn.style("background-color", "green");

  let blueBtn = createButton("BLUE");
  blueBtn.style("background-color", "cyan");

  colorButtons.push(redBtn);
  redBtn.mousePressed(redColor);
  colorButtons.push(yellowBtn);
  yellowBtn.mousePressed(yellowColor);
  colorButtons.push(greenBtn);
  greenBtn.mousePressed(greenColor);
  colorButtons.push(blueBtn);
  blueBtn.mousePressed(blueColor);


  for(let i =0; i < colorButtons.length; i++) {
    let btn = colorButtons[i];
    btn.position(100 + (i * 80), 150);
  }
}

function redColor() {
  selectedColor = [255,0,0];
}

function yellowColor() {
  selectedColor = [255,204,0];
}

function greenColor() {
  selectedColor = [0,255,0];
}

function blueColor() {
  selectedColor = [0,255,255];
}


function setup() {
  // createCanvas(windowWidth, windowHeight - 100);
  createCanvas(600, 600);
  background(100);
  frameRate(60);

  makeDOM();
}

function draw() {

  if(mazeUpdated) {
    background(0);

    // draw maze
    maze.draw();
  } else {

    textSize(30);
    fill(255, 0 ,0);
    text(infoMsg,100, 300);
  }
}

function removePlayer(removingPlayer) {
  // player: id, name, color, i, j
  for(let i = 0; i < maze.players.length; i++) {
    if(maze.players[i].name == removingPlayer.name) {
      maze.players.splice(i, 1);
    }
  }
}

function updateClientMaze(data) {
  print("updateClientMaze");
  // 자신이 보낸것이면 무시
  if(data.sender == name) {
    print("pass my event");
    return;
  }

  if(data.maze != undefined) {
    print("maze updated!");
    // maze의 기본 변수 할당(정수, 문자열 등등)
    maze = Object.assign(new Maze(), data.maze);
    // maze의 객체 다시 할당
    maze.assignAllObject(data);

    updatePlayerBoard(data.maze);
  }

  mazeUpdated = true;
}

function enterGame() {

  // MazeGenerator
  mpg = new MazePathGenerator();

  // MazePathFinder
  mpf = new MazePathFinder();

  // Maze
  maze = new Maze(cellSize, mpg, mpf);
  maze.initMaze();

  // Player
  let color = selectedColor;

  name = nameInput.value();
  player1 = new Player(name, color);

  // drop player to maze
  maze.dropPlayer(player1);
  // maze.dropPlayer(player2);





  // 먼저 maze데이터 받아와서 name, color 중복 검사
  // socket code
  
  socket = io.connect("localhost:3000");

  // on (밑의 setMaze emit()보다 먼저 리스너 등록해야 함: 미리 미로세팅을 받아와야 하기 때문에)
  socket.on("updateClientMaze", updateClientMaze);

  // name이 중복인지, 비어있는지 검사
  // for(let p of maze.players) {
  //   print("name: "+p.name);
  //   if(p.name === name) {
  //     infoMsg = "same name already exists";
  //     print("same name already exists");
  //     return;
  //   }
  // }


  // 색깔이 선택됬는지 검사
  // if(selectedColor == undefined) {
  //   infoMsg = "select color";
  //   print("select color");
  //   return;
  // }

  // 인원이 꽉 찬지 검사







  let mazeData = {
    maze: maze
  };
  socket.emit("setMaze", mazeData);

  // remvoe DOM elements
  removeElements();
}

function updatePlayerBoard(maze) {
  for(let b of playerBoard) {
    b.remove();
  }

  // print("update player board");
  // 650, 50 / 750, 20
  //650, 100 / 750, 70
  for(let i  = 0; i < maze.players.length; i++) {
      let p = maze.players[i];
    let btn = createButton(p.name);
    let rgbStr = "rgb(" + p.color[0] +","+ p.color[1]+"," + p.color[2] + ")";
    btn.style("background-color", rgbStr);
    btn.style("font-size", "30px");
    btn.position(650, 50 + (i * 50));
    playerBoard.push(btn);
  }
}



















//
