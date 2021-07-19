/*
[TIP]
class 객체를 넘겨받았을때:
속성은 그대로 접근이 가능하지만, 함수들은 사용 불가능
-> 클래스를 넘겨받는쪽에서도 만들어서 사용해야 함 (Object.assign)
*/

// let players = [];

// maze는 처음들어온 사람(=방장)의 것으로 한다
// or 골인한 사람의 것
// or 다시시작한 사람의 것
// or maze change item 사람의 것
let maze;

let express = require("express");
let socket = require("socket.io");

let app = express();
let server = app.listen(3000);

app.use(express.static('.'));

console.log("My socket server is running")


let io = socket(server);

io.sockets.on("connection", newConnection);

function newConnection(socket) {
  // console.log("new connection: " + socket.id);
  // printConnectingSocketsCount();

  updateClientMaze(undefined);

  socket.on("setMaze", setMaze);
  function setMaze(data) {
    // 방장이면 maze 등록

    // client에서 직접 오는 플레이어(무조건 players[0]) socket id 등록
    let clientPlayer = data.maze.players[0];
    clientPlayer.socketID = socket.id;
    console.log("================================");
    console.log("socketID: "+clientPlayer.socketID);
    console.log("client name: " + clientPlayer.name);


    // maze등록 또는 불러오기
    if(getConnectingSocketsCount() == 1) {
      console.log("Maze Room Master!!!!!!!!!!!!!!!!!!!");
      maze = data.maze;
    }
    else {
      maze.players.push(clientPlayer);
      // 새로 들어온 유저 미로를 서버미로와 동기화
      updateClientMaze(undefined);
    }

    console.log("player count: " + maze.players.length);
    console.log("================================");
  }

  socket.on("updateServerMaze", updateServerMaze);
  function updateServerMaze(data) {
    // server maze가 업데이트되면 자동으로 모든 클라이언트들에게 업데이트된 maze 전송zz
    maze = data.maze;
    updateClientMaze(data.sender);
  }

  socket.on("requestUpdateClientMaze", requestUpdateClientMaze);
  function requestUpdateClientMaze(data) {
    updateClientMaze(undefined);
  }

  socket.on('disconnect', disconnect);

  function disconnect(reason) {
    console.log("Reason: " + reason);
    if(maze == undefined) {
      return;
    }
    // maze의 players에서
    for(let i = 0; i < maze.players.length; i++) {
      let p = maze.players[i];
      if(p.socketID == socket.id) {
        maze.players.splice(i, 1);
        console.log(p.name + " exit game");
        printConnectingSocketsCount();
        printMazePlayersCount();

        updateClientMaze(p.name);
      }
    }
  }
}


// setInterval(updateClientMaze, 500);


function updateClientMaze(sender) {
  let data = {
    maze: maze,
    sender: sender
  };
  io.sockets.emit("updateClientMaze", data);
}

function printConnectingSocketsCount() {
  // print connecting socket count
  console.log("socket count: " + io.engine.clientsCount);
}

function getConnectingSocketsCount() {
  return io.engine.clientsCount;
}

function printMazePlayersCount() {
  console.log("maze players count: " + maze.players.length);
}














//
