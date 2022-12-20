const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");
const socket = new WebSocket(`ws://${window.location.host}`);
// 클라이언트에서 socket은 서버를 의미함

const handleOpen = () => {
  console.log("Connected To Browser!!");
};

socket.addEventListener("open", handleOpen);

socket.addEventListener("message", (message) => {
  console.log("New message: ", message.data);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server");
});

setTimeout(() => {
  socket.send("hello from the browser!");
}, 10000);

const handleSubmit = (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(input.value);
  input.value = "";
};

messageForm.addEventListener("submit", handleSubmit);
