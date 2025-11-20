const {
  default: makeWASocket,
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} = require("@whiskeysockets/baileys");

const express = require("express");
const qrcode = require("qrcode-terminal");
const pino = require("pino");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

// Middleware
app.use(express.json());
app.use(cors());

let sock;
let qrCodeData = null;
let isConnected = false;

// API Key Middleware
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized: Invalid API Key" });
  }

  next();
};

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");

  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: "silent" }),
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrCodeData = qr;
      console.log("\n=== QR CODE ===");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      isConnected = true;
      qrCodeData = null;
      console.log("✅ WhatsApp Connected!");
    }

    if (connection === "close") {
      isConnected = false;
      const reason = lastDisconnect?.error?.output?.statusCode;

      console.log("❌ Connection closed. Reason:", reason);

      if (reason !== DisconnectReason.loggedOut) {
        console.log("🔁 Reconnecting...");
        connectToWhatsApp();
      } else {
        console.log("⚠ Logged out. Scan QR again.");
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

// ROUTES
app.get("/", (req, res) => {
  res.json({
    status: "running",
    connected: isConnected,
    message: "WhatsApp API Server",
  });
});

// Session Status
app.get("/api/sessions/default", authenticateApiKey, (req, res) => {
  res.json({
    name: "default",
    status: isConnected ? "WORKING" : "STOPPED",
    qr: qrCodeData,
    me: isConnected ? sock.user : null,
  });
});

// Send Text
app.post("/api/sendText", authenticateApiKey, async (req, res) => {
  const { chatId, text } = req.body;

  if (!chatId || !text) {
    return res.status(400).json({ error: "chatId and text are required" });
  }

  if (!isConnected) {
    return res.status(503).json({ error: "WhatsApp is not connected" });
  }

  try {
    await sock.sendMessage(chatId, { text });

    res.json({
      status: "success",
      message: "Message sent",
      chatId,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Send Image
app.post("/api/sendImage", authenticateApiKey, async (req, res) => {
  const { chatId, file, caption } = req.body;

  if (!chatId || !file?.url) {
    return res.status(400).json({ error: "chatId and file.url are required" });
  }

  if (!isConnected) {
    return res.status(503).json({ error: "WhatsApp is not connected" });
  }

  try {
    await sock.sendMessage(chatId, {
      image: { url: file.url },
      caption: caption || "",
    });

    res.json({
      status: "success",
      message: "Image sent",
      chatId,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to send image" });
  }
});

// Start Server
app.listen(PORT, async () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔑 API Key: ${API_KEY}`);
  await connectToWhatsApp();
});
