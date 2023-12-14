const login = document.querySelector(".login");
const formLogin = document.querySelector(".form-login");
const inputLogin = document.querySelector(".input-name");

const chat = document.querySelector(".chat");
const formChat = document.querySelector(".chat-form");
const inputChat = document.querySelector(".chat-input");
const messagesChat = document.querySelector(".messages");

let ws;

const colors = [
  "cadetblue",
  "darkgoldenrod",
  "cornflowerblue",
  "darkkhaki",
  "hotpink",
  "gold",
];

const randomColor = () => {
  const randomNumber = Math.floor(Math.random() * colors.length);
  return colors[randomNumber];
};

const user = { id: "", name: "", color: "" };

const selfMessage = (message) => {
  const div = document.createElement("div");

  div.classList.add("self-message");
  div.textContent = message;
  messagesChat.appendChild(div);
  return div;
};

const otherMessage = (name, color, message) => {
  const div = document.createElement("div");
  const span = document.createElement("span");
  const p = document.createElement("p");

  div.classList.add("other-message");
  span.classList.add("message-sender");
  p.classList.add("p-chat");
  span.style.color = color;

  span.textContent = name;
  p.textContent = message;
  div.appendChild(span);
  div.appendChild(p);

  messagesChat.appendChild(div);
  return div;
};

const scrollScreen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};

const processMessage = ({ data }) => {
  const { userId, userName, userColor, userMessage } = JSON.parse(data);

  if (userId === user.id) {
    selfMessage(userMessage);
  } else {
    otherMessage(userName, userColor, userMessage);
  }

  scrollScreen();
};

const dataLogin = (event) => {
  event.preventDefault();

  user.id = crypto.randomUUID();
  user.name = inputLogin.value;
  user.color = randomColor();

  login.style.display = "none";
  chat.style.display = "flex";

  ws = new WebSocket("ws://localhost:8080");
  ws.onmessage = processMessage;
};

const dataChat = (event) => {
  event.preventDefault();

  const message = {
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    userMessage: inputChat.value,
  };

  ws.send(JSON.stringify(message));

  inputChat.value = "";
};

formLogin.addEventListener("submit", dataLogin);
formChat.addEventListener("submit", dataChat);