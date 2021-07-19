# Image
- joinGame
![joinGame](https://github.com/worldbiomusic/internet-maze-game/blob/main/imgs/joinGame.PNG)

- gamePlay
![gamePlay](https://github.com/worldbiomusic/internet-maze-game/blob/main/imgs/gamePlay.PNG)

- cmd
![cmd](https://github.com/worldbiomusic/internet-maze-game/blob/main/imgs/cmd.PNG)

# Internet Maze Game
- Internet version of my [single play version](https://github.com/worldbiomusic/multiplay-maze-game)
- This game works as a server-clinet model

# How to start game server (window)
1. edit code `socket = io.connect("localhost:3000");` with your [ip:port](https://github.com/worldbiomusic/internet-maze-game/blob/bd63bf10c961e0e0352ef5102f6d770754ad8c7d/sketch.js#L169) in mazeGame_server.js file
2. Download and setup Node.js
3. Download express.js and socket.io package with npm
4. Run server with **"node mazeGame_server.js"** command in cmd
5. Let other players know your server ip to join your maze game server
6. Enjoy

❗ If you don't use WIFI, just let other players know your public IP  
❗ If you use WIFI, You have to do port-forwarding  
❗ press `Ctrl + C` to stop the server  

# How to join the game server
1. enter server ip in broswer
2. Input your player name
3. Select your color
4. Press Enter "START"

# Bug
- Game may roll back when two or more players send events at the same moment. It's quite serious. (***I want to fix it...***)
- Poor exception handling
