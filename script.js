// complete the code
const statusDiv = document.getElementById("status");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const disconnectButton = document.getElementById("disconnect-button");
const notificationsDiv = document.getElementById("notifications");
const wsUrl = "wss://socketsbay.com/wss/v2/1/demo/";
let socket;
let reconnectTimer = null;

const displayNotification = (message) => {
  const p = document.createElement("p");
  p.textContent = message;
  notificationsDiv.appendChild(p);
};

const updateStatus = (text, canSend) => {
  statusDiv.textContent = text;
  sendButton.disabled = !canSend;
};

const connectWebSocket = () => {
  socket = new WebSocket(wsUrl);
  updateStatus("Connecting...", false);

  socket.onopen = () => {
    updateStatus("Connected", true);
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  socket.onmessage = (event) => {
    displayNotification(event.data);
  };

  socket.onclose = () => {
    updateStatus("Disconnected. Reconnecting in 10s...", false);
    reconnectTimer = setTimeout(() => {
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