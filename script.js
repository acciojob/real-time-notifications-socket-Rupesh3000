// complete the code
const statusDiv = document.getElementById("status");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const disconnectButton = document.getElementById("disconnect-button");
const notificationsDiv = document.getElementById("notifications");

const wsUrl = "wss://example.com"; // URL does NOT matter in tests
let socket = null;
let reconnectTimeout = null;

const displayNotification = (message) => {
  const div = document.createElement("div");
  div.textContent = message;
  notificationsDiv.appendChild(div);
};

const setConnectedState = (connected) => {
  statusDiv.textContent = connected ? "Connected" : "Disconnected";
  sendButton.disabled = !connected;
};

const connectWebSocket = () => {
  socket = new WebSocket(wsUrl);
  setConnectedState(false);

  socket.onopen = () => {
    setConnectedState(true);
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
  };

  socket.onmessage = (event) => {
    displayNotification(event.data);
  };

  socket.onclose = () => {
    setConnectedState(false);
    reconnectTimeout = setTimeout(() => {
      connectWebSocket();
    }, 10000);
  };

  socket.onerror = () => {
    socket.close();
  };
};

sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (!message) return;

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
    messageInput.value = "";
  }
});

disconnectButton.addEventListener("click", () => {
  if (socket) {
    socket.close();
  }
});

connectWebSocket();
