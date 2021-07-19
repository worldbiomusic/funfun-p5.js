class Maze {
  /*
  Maze class로 Cell class의 배열을 가지며(1차원),
  TOP, RIGHT, BOTTOM, LEFT를 사용

  -모든 클래스의 중심

  */

  /*
  attribute
  - mpg
  - mpf
  - TOP
  - RIGHT
  - BOTTOM
  - LEFT
  - pathDrawing
  - players
  - item
  - size
  - grid
  - cols
  - rows
  - winScore
  - state: game진행을 막기위해 key 입력금지

  method
  - constructor(size, mpg, mpf)
  - swapLocationEachOther(obj1, obj2)
  - getRandomJLocation()
  - getRandomILocation()
  - teleportObject(obj, i, j)
  - getRandomPlayer(exceptPlayer = null)
  - drawWinnerImage(winner)
  - isSameLocation(obj1, obj2)
  - resetGame()
  - initMaze()
  - resetAllPlayers()
  - dropPlayer(player)
  - createItem()
  - setSize()
  - getSize()
  - setPathDrawing(pathDrawing)
  - initGrid()
  - draw()
  - getAllNeighbors(cell)
  - removeWalls(a, b)
  - getDirCell(cell, dir)
  - index(i, j)
  - checkNeighbors(cell, checkVisit, checkWall)



  */
  constructor(size, mpg, mpf) {
    this.setSize(size);
    this.mpg = mpg;
    // mpg.registerMaze(this);
    this.mpf = mpf;
    // mpf.registerMaze(this);

    // direction
    this.TOP = 0;
    this.RIGHT = 1;
    this.BOTTOM = 2;
    this.LEFT = 3;

    // path
    this.pathDrawing = false;

    // players
    this.players = [];

    // win score
    this.winScore = 8;

    // state
    this.state = true;
  }

  assignAllObject(data) {
    // cell이 함수 오류남 (cell.show is not a function)
    // Object.assign() 함수는 반환값을 가지고 이용해야 한다. 내부에서 target에 실제로 복사되는것이 아니다

    let mazeData = data.maze;

    // grid
    for(let i = 0;i < mazeData.grid.length; i++) {
      this.grid[i] = Object.assign(new Cell(), mazeData.grid[i]);
    }

    // players
    for(let i = 0;i < mazeData.players.length; i++) {
      this.players[i] = Object.assign(new Player(), mazeData.players[i]);
    }

    // mpg
    this.mpg = Object.assign(new MazePathGenerator(), mazeData.mpg);

    // mpf
    this.mpf = Object.assign(new MazePathFinder(), mazeData.mpf);

    // Item
    this.item = Object.assign(new Item(), mazeData.item);
  }

  hasPlayer(playerName) {
    // name으로 구별
    for(let p of this.players) {
      if(p.name == playerName) {
        return true;
      }
    }

    return false;
  }

  swapLocationEachOther(obj1, obj2) {
    let obj1I = obj1.i;
    let obj1J = obj1.j;

    print("i: " + obj1.i + "j: " + obj1.j);
    this.teleportObject(obj1, obj2.i, obj2.j);
    print("i: " + obj1.i + "j: " + obj1.j);


    this.teleportObject(obj2, obj1I, obj1J);
  }

  getRandomJLocation() {
    let rj = floor(random(this.rows));
    return rj;
  }

  getRandomILocation() {
    let ri = floor(random(this.cols));
    return ri;
  }

  teleportObject(obj, i, j) {
    i = constrain(i, 0, this.cols - 1);
    j = constrain(j, 0, this.rows - 1);

    obj.i = i;
    obj.j = j;
  }

  getRandomPlayer(exceptPlayer = null) {
    let others = [];
    for (let p of this.players) {
      if (p !== exceptPlayer) {
        others.push(p);
      }
    }

    return random(others);
  }

  drawWinnerImage(winner) {
    // background rect
    fill(winner.color);
    rect(50, 50, width - 100, height - 100);

    //winner: 100, 200 (100)
    //this.name: 150 390 (200)

    // "winner" text
    fill(0);
    textSize(100);
    text("winner", 100, 150);

    // this.name text
    fill(0);
    textSize(200);
    text(winner.name, 150, 340);

    // "press 0"
    fill(0);
    textSize(35);
    text("press 0 to restart", 108, 430);
  }

  isSameLocation(obj1, obj2) {
    /*
    이 메소드 사용조건: 두개의 obj에 i, j 속성이 필수임
    */
    return (obj1.i === obj2.i && obj1.j === obj2.j);
  }

  resetGame() {
    this.setSize(cellSize);
    this.initMaze();
    this.resetAllPlayers();

    this.state = true;
  }

  initMaze() {
    this.initGrid();

    this.mpg.generateMaze(this);

    this.mpf.findPath(this);

    this.createItem();
  }

  resetAllPlayers() {
    for (let p of this.players) {
      p.init();
    }
  }

  dropPlayer(player) {
    this.players.push(player);
  }

  createItem() {
    this.item = new Item();
    this.item.init(this);
  }

  setSize(size) {
    this.size = size;
  }

  getSize() {
    return this.size;

  }

  setPathDrawing(pathDrawing) {
    this.pathDrawing = pathDrawing;
  }

  initGrid() {
    this.grid = [];
    this.cols = floor(width / this.size);
    this.rows = floor(height / this.size);

    // setup grid
    // cols(가로 먼저 만들면서 내려감)
    // (0,0) (1,0) (2,0) (3,0) ...
    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {
        let cell = new Cell(i, j, this.size);
        this.grid.push(cell);
      }
    }

    this.grid[0].text = 'A';
    this.grid[this.grid.length - 1].text = 'B';
  }



  getAllNeighbors(cell) {
    /*
    단순히 cell의 주변 4개의 이웃셀을 배열로 반환한다
    */
    // undefined or Cell instance in array
    let neighbors = [];

    neighbors[this.TOP] =
    this.getDirCell(cell, this.TOP);
    neighbors[this.RIGHT] =
    this.getDirCell(cell, this.RIGHT);
    neighbors[this.BOTTOM] =
    this.getDirCell(cell, this.BOTTOM);
    neighbors[this.LEFT] =
    this.getDirCell(cell, this.LEFT);

    return neighbors;
  }


  // highlight() {
  //   noStroke();
  //   fill(0, 255, 0);
  //   rect(this.i * w, this.j * w, w, w);
  // }

  removeWalls(a, b) {
    /*
    cell a와 b가 맞닿아 있는 wall을 제거한다
    */
    let di = a.i - b.i;
    let dj = a.j - b.j;

    if (di === -1) {
      a.walls[this.RIGHT] = false;
      b.walls[this.LEFT] = false;
    } else if (di === 1) {
      a.walls[this.LEFT] = false;
      b.walls[this.RIGHT] = false;
    }

    if (dj === -1) {
      a.walls[this.BOTTOM] = false;
      b.walls[this.TOP] = false;
    } else if (dj === 1) {
      a.walls[this.TOP] = false;
      b.walls[this.BOTTOM] = false;
    }
  }

  getDirCell(cell, dir) {
    /*
    cell의 dir방향의 cell을 반환한다
    */
    let i = cell.i;
    let j = cell.j;

    switch (dir) {
      case this.TOP:
      j--;
      break;
      case this.RIGHT:
      i++;
      break;
      case this.BOTTOM:
      j++;
      break;
      case this.LEFT:
      i--;
      break;
    }

    let index = this.index(i, j);

    return this.grid[index];
  }

  index(i, j) {
    /*
    maze class의 cell들을 1차원 배열로 만들었고
    cell class는 2차원형식의 i, j를 가지고 있기 때문에
    cell class의 i, j를 maze class의 배열에서 index를 계산식을
    가지고 구할때 쓰는 메소드
    */
    if (i < 0 || j < 0 || i > this.cols - 1 || j > this.rows - 1)
    return -1;
    else
    return i + (j * this.cols);
  }

  checkNeighbors(cell, checkVisit, checkWall) {
    /*
    cell의 이웃중에서 checkVisit과 checkWall옵션에 따라 검사해서
    옵션에 부합하는 이웃cell객체중 1개를 랜덤으로 반환한다
    */
    let neighbors = this.getAllNeighbors(cell);

    // neighbors에서
    for (let i = 0; i < 4; i++) {
      if ((neighbors[i] == undefined) || // screenBorder
      (checkVisit && neighbors[i].visited) || // visited
      (checkWall && neighbors[i].walls[(i + 2) % 4])) // wall
      {
        neighbors[i] = undefined;
      }
    }

    let ret = [];

    for (let n of neighbors) {
      if (n != undefined)
      ret.push(n);
    }

    return random(ret);
  }


  draw() {
    /*
    cell 배열 (this.gird)를 그린다 (cell class의 show())
    [옵션]
    this.pathDrawing:
    maze class에서 path를 나타낼 여부 변수
    */

    // draw cells
    for (let cell of this.grid) {
      cell.show();
    }

    // draw path
    if (this.pathDrawing) {
      for (let cell of this.grid) {
        cell.connectLine(cell.nextPathCell);
      }
    }

    // show item
    this.item.show(this);

    // manage players
    for (let p of this.players) {
      // show
      p.show(this);

      // check eating item
      // this.checkEatingItem(p, this.item);

      // check win
      if (this.checkWin(p)) {
        this.drawWinnerImage(p);
        if (DEBUG) {
          // print(p.name + " has win!");
        }
        this.state = false;
      }
    }
  }

  //###################
  // Player관련 메소드
  //###################

  // !maze에서 player.scoreCnt를 가지고 비교
  checkWin(player) {
    // check and draw winner
    if (player.scoreCnt === this.winScore) {
      return true;
    }
  }

  // !maze에서 비교하가
  checkEatingItem(playerName, item) {
    let p = this.getPlayer(playerName);
    // print("p: " + p.i + ":"+p.j);
    // print("item: " + item.i + ":"+item.j);
    if (this.isSameLocation(p, item)) {
      if (DEBUG) {
        print(p.name + " eats item!");
      }
      item.useItem(p, this);
    }
  }

  // !maze에서 player.dir가지고 판단
  respawn(player) {
    if (player.dir === 'A') {
      player.i = this.cols - 1;
      player.j = this.rows - 1;
    } else {


      player.i = player.j = 0;
    }
  }

  // !maze에서 dir인자 가지고 player 움직이기
  move(name, dir) {

    let player = this.getPlayer(name);

    let currentCell =
    this.grid[this.index(player.i, player.j)];

    if (currentCell.walls[dir]) {
      return;
    }

    let nextCell = this.getDirCell(currentCell, dir);

    player.i = nextCell.i;
    player.j = nextCell.j;

    this.checkExit(player);

    // print(this.name + ": " + (currentCell !== nextCell));
    // 움직였는지 boolean값으로 return
    // move: true
    // not move: false
    if (currentCell !== nextCell) {
      player.movingCnt++;
      player.updateMovingCnt();
    }
  }

  // !maze로 옮겨서 비교하기
  checkExit(player) {
    if (((player.i === 0) && (player.j === 0) && player.dir === 'A') ||
    ((player.i === this.cols - 1) && (player.j === this.rows - 1) && player.dir === 'B')) {

      // reload maze small
      this.setSize(this.getSize() - 5);
      this.initMaze();
      player.changeDir();

      // score
      player.scoreCnt++;
      player.updateScoreCnt();

      // set maze path drawing to false
      this.setPathDrawing(false);

      // respawn
      this.respawn(player);
    }
  }

  getPlayer(name) {
    for(let p of this.players) {
      if(p.name === name) {
        return p;
      }
    }
    return null;
  }













}




// #############
// key functions
// #############
function keyPressed() {
  // block updating wrong maze
  if(!mazeUpdated) {
    print("server maze is not loaded");
    return;
  }

  if (!maze.state && keyCode != 48) {
    return;
  }


  let dir1;
  let dir2;

  if (DEBUG) {
    // print("keyCode: " + keyCode);
  }


  switch (keyCode) {



    // player1
    case UP_ARROW:
    dir1 = 0;
    break;
    case RIGHT_ARROW:
    dir1 = 1;
    break;
    case DOWN_ARROW:
    dir1 = 2;
    break;
    case LEFT_ARROW:
    dir1 = 3;
    break;
    case 49: // number 1
    maze.respawn(player1);
    break;
    case 191: // /(slash)
    // player.eaiting을 true로 만들지 말고, /를 눌렀을때 플레이어위치와 item위치가 같은지
    // 검사해서 같을시 아이템.use() 호출하게 만들기 (해당 player만 호출하므로 결과 동일)
    // maze.getPlayer(player1.name).eating = true;
    maze.checkEatingItem(name, maze.item);

    break;

    // // player2
    // case 87: // w
    // dir2 = 0;
    // break;
    // case 68: // d
    // dir2 = 1;
    // break;
    // case 83: // s
    // dir2 = 2;
    // break;
    // case 65: // a
    // dir2 = 3;
    // break;
    // case 50: // number 2
    // maze.respawn(player2);
    // break;
    // case 69: // e
    // player2.eating = true;
    // break;
    //
    // // common
    // case 77: // m
    // maze.setPathDrawing(!maze.pathDrawing);
    //
    //
    // case 189: // -
    //
    // break;
    //
    // case 187: // +
    //
    // break;

    case 48: // 0
    maze.resetGame();
    break;
  }


  maze.move(name, dir1);
  // 2인용 멀티게임처럼 만들면 재밌을듯(크아처럼)
  // maze.move(player2, dir2);


  // socket server에 전송
  let mazeData = {
    maze: maze,
    sender: name
  };
  socket.emit("updateServerMaze", mazeData);
}
