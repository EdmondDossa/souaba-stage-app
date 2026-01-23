"use client";

import { io } from "socket.io-client";

const rawSocketPath = process.env.NEXT_PUBLIC_SOCKET_PATH || "/socket.io";
const socketPath =
  rawSocketPath && rawSocketPath.startsWith("/")
    ? rawSocketPath
    : "/socket.io";
const socketBaseUrl =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "";

class SocketManager {
  constructor() {
    this.socket = null;
  }

  connect(token, { onMessage, onConversation, onError, onConnect, onDisconnect } = {}) {
    if (!socketBaseUrl || !token) {
        console.error("SocketManager: NEXT_PUBLIC_SOCKET_URL and token must be provided.");
        return null;
    }

    // If a socket is already connected, just re-bind the event handlers
    if (this.socket && this.socket.connected) {
        this.socket.removeAllListeners();
    }
    // If a socket instance exists but is disconnected, get rid of it.
    else if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
    }

    // If there is no socket, create one.
    if (!this.socket) {
        this.socket = io(socketBaseUrl, {
            path: socketPath,
            transports: ["polling"],
            withCredentials: true,
            timeout: 12000,
            reconnectionAttempts: 3,
            reconnectionDelay: 1200,
            forceNew: true,
            extraHeaders: token ? { Authorization: `Bearer ${token}` } : undefined,
            auth: token ? { token } : undefined,
            autoConnect: true,
        });
    }

    // Bind event handlers
    if (onConnect) this.socket.on("connect", onConnect);
    if (onDisconnect) this.socket.on("disconnect", onDisconnect);
    if (onError) this.socket.on("connect_error", onError);
    if (onMessage) this.socket.on("newMessage", onMessage);
    if (onConversation) this.socket.on("conversation:new", onConversation);

    return this.socket;
  }

  isConnected() {
    return !!this.socket?.connected;
  }

  joinConversation(conversationId) {
    if (!this.socket || !conversationId) return;
    this.socket.emit("joinConversation", { conversationId });
  }

  sendMessage(payload) {
    if (!this.socket) throw new Error("Socket non initialisée");
    this.socket.emit("sendMessage", payload);
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketManager = new SocketManager();
