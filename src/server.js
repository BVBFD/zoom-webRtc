import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
// pub로 view engine 설정하고...
app.set("views", __dirname + "/views");
// html template이 어디 있는지 설정하고
app.use("/public", express.static(__dirname + "/public"));
// 유저들이 자바스크립트 파일에 접근하기 위함.
// (서버 안의 파일을 유저가 보는건 보안상 일반적으로 위험하니깐 이렇게 따로 지정해주는 거임)
// __dirname 현재 실행하는 파일의 절대 경로임.
// express.static은 정적파일 제공을 위한 NodeJS 문법임
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));
// 다른 url은 사용하지 않을 거임!

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// app.listen(3000, handleListen);
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
// Http와 WebSocket 서버 둘다 작동시키는 것임.
// Http 서버 위에서 WebSocket 서버를 만들기 위함임.
// 그러므로 localhost는 동일한 포트에서 http, ws request 두 개를 다 처리할 수 있음.

// const handleConnection = (socket) => {
//   console.log(socket);
//   // socket은 브라우저와 서버 사이의 연결 객체임.
//   // 한번 연결되면 계속 real-time으로 소통할 수 있음.
//   // 서버에서의 socket은 front-end 브라우저를 뜻함.
// };

const onSocketClose = () => {
  console.log("Disconnected from the Browser");
};

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  console.log("Connected To Browser!!");
  socket.on("close", onSocketClose);
  socket.on("message", (message) => {
    const messageString = message.toString("utf-8");
    sockets.forEach((aSocket) => aSocket.send(messageString));
    // socket.send(messageString);
  });
  socket.send("hello!!!");
});

server.listen(3000, handleListen);
