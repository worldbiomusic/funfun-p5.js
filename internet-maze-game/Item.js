class Item {

  /*
  attrubute
  - i
  - j
  - realCenterX
  - realCenterY
  - maze
  - color


  method
  - constructor()
  - init()
  - setRandomColor()
  - show()
  - registerMaze(maze)
  - useItem(player)
  - initMazeAbility(player)
  - swapWithRandomPlayerAbility(player)
  - drawPathAbility(player)
  - moveToRandomLocation(player)
  - passRandomWall(player)
  - respawnRandomPlayer(player)


  */

  constructor() {
    this.color = [255, 0, 0];
    this.abilityCount = 7;
  }

  init(maze) {
    // i, j
    this.i = floor(random(maze.cols));
    this.j = floor(random(maze.rows));

    // real x, y
    this.realCenterX = (this.i * maze.size) + (maze.size * (1 / 2));
    this.realCenterY = (this.j * maze.size) + (maze.size * (1 / 2));

    // change color
    this.setRandomColor();

    // 해당 객체가 현재가지고 있는 ability를 나타냄
    this.ability = floor(random(this.abilityCount)) + 1;
  }

  setRandomColor() {
    let r = floor(random(255));
    let g = floor(random(255));
    let b = floor(random(255));

    this.color = [r, g, b];
  }

  show(maze) {
    fill(this.color);
    noStroke();
    ellipseMode(CENTER);
    ellipse(this.realCenterX, this.realCenterY, maze.size * (3 / 5));
  }

  useItem(player, maze) {
    // 여기서 maze도 넘겨받기
    print("ability: "+this.ability);

    switch (this.ability) {
      case 1:
      this.initMazeAbility(player, maze);
      break;
      case 2:
      this.swapWithRandomPlayerAbility(player, maze);
      break;
      case 3:
      this.pathAbility(player, maze);
      break;
      case 4:
      this.moveToRandomLocation(player, maze);
      break;
      case 5:
      this.passRandomWall(player, maze);
      break;
      case 6:
      this.respawnRandomPlayer(player, maze);
      break;
      case 7:
      this.changeDirAbility(player, maze);
      break;
    }

    // change item location
    this.init(maze);
  }

  initMazeAbility(player, maze) {
    // 1: reload maze with same size
    maze.initMaze();
    print("initMazeAbility");
  }

  swapWithRandomPlayerAbility(player, maze) {
    // 2: swap location with other random player

    let randomPlayer = maze.getRandomPlayer(player);
    if(randomPlayer.length > 1) {
      maze.swapLocationEachOther(player, randomPlayer);
      print("swapWithRandomPlayerAbility");
    }
  }

  pathAbility(player, maze) {
    // 3: draw or remove maze path until someone gets score
    maze.setPathDrawing(!maze.drawingPath);

    print("drawPathAbility");
  }

  moveToRandomLocation(player, maze) {
    // 4: move player to random location

    let ri = maze.getRandomILocation();
    let rj = maze.getRandomJLocation();

    maze.teleportObject(player, ri, rj);

    print("moveToRandomLocation");
  }

  passRandomWall(player, maze) {
    // 5: pass random wall from player's location

    let randomDir = floor(random(4));

    let di = 0 , dj = 0;

    switch (randomDir) {
      case maze.TOP:
      dj = -1;
      break;
      case maze.RIGHT:
      di = 1;
      break;
      case maze.BOTTOM:
      dj = 1;
      break;
      case maze.LEFT:
      di = -1;
      break;
    }

    maze.teleportObject(player, player.i + di, player.j + dj);

    print("passRandomWall");
  }

  respawnRandomPlayer(player, maze) {
    // 6: respawn random player

    maze.respawn(player);

    print("respawnRandomPlayer");
  }

  changeDirAbility(player, maze) {
    player.changeDir(player);
  }
}
