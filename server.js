const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
let lastOnline = 0;

app.use(express.json());

const PORT = process.env.PORT || 3000;

// ====================================
// SERVER
// ====================================

const server = http.createServer(app);

const wss = new WebSocket.Server({
    server,
    path: "/ws"
});

// ====================================
// ESP32
// ====================================

let esp32 = null;

// ====================================
// TEST WEB
// ====================================

app.get("/", (req, res) => {

    res.send("NAMRICE REALTIME OK");
});
    
app.get("/open5", (req, res) => {

  // KIEM TRA KEY
  if(req.query.key !== "NAMRICE_SECRET_2026") {

    return res.send("SAI KEY");

  }

  // GUI LENH MO RELAY
  if (esp32) {

    esp32.send(JSON.stringify({
      type: "open",
      relay: 5
    }));

    res.send("DA MO RELAY 5");

  } else {

    res.send("ESP32 OFFLINE");

  }



});

// ====================================
// ESP32 CONNECT
// ====================================

wss.on("connection", (ws) => {

    console.log("ESP32 ONLINE");

    esp32 = ws;

    ws.on("close", () => {

        console.log("ESP32 OFFLINE");

        esp32 = null;

    });

    app.get("/status", (req, res) => {

    if(req.query.key !== "NAMRICE_SECRET_2026") {

        return res.send("SAI KEY");
    }

    const now = Date.now();

    if(now - lastOnline < 40000) {

        res.send("ESP32 ONLINE");

    } else {

        res.send("ESP32 OFFLINE");
    }

});

    ws.on("message", (msg) => {

    const data = JSON.parse(msg);

    if(data.type === "online") {

        lastOnline = Date.now();
    }

    console.log(data);

});

});

// ====================================
// SEPAY WEBHOOK
// ====================================

app.post("/sepay", (req, res) => {

    const apiKey = req.headers["authorization"] || "";

    if (apiKey !== "Apikey Aa12345678@") {

        return res.status(403).send("Forbidden");

    }

    console.log(req.body);

    const amount = Number(req.body.transferAmount || 0);

    const content = (req.body.content || "").toLowerCase();

    // ====================================
    // GẠO Ô 1
    // ====================================

    if (
        amount >= 2000 &&
        content.includes("gao1")
    ) {

        console.log("MO O GAO 1");

        if (esp32) {

            esp32.send("OPEN_1");

        }

    }

    // ====================================
    // GẠO Ô 2
    // ====================================

    if (
        amount >= 2000 &&
        content.includes("gao2")
    ) {

        console.log("MO O GAO 2");

        if (esp32) {

            esp32.send("OPEN_2");

        }

    }

    // ====================================
    // GẠO Ô 3
    // ====================================

    if (
        amount >= 2000 &&
        content.includes("gao3")
    ) {

        console.log("MO O GAO 3");

        if (esp32) {

            esp32.send("OPEN_3");

        }

    }

    // ====================================
    // GẠO Ô 4
    // ====================================

    if (
        amount >= 2000 &&
        content.includes("gao4")
    ) {

        console.log("MO O GAO 4");

        if (esp32) {

            esp32.send("OPEN_4");

        }

    }

    // ====================================
    // GẠO Ô 5
    // ====================================

    if (
        amount >= 2000 &&
        content.includes("gao5")
    ) {

        console.log("MO O GAO 5");

        if (esp32) {

            esp32.send("OPEN_5");

        }

    }

    res.send("OK");

});

// ====================================
// START
// ====================================

server.listen(PORT, () => {

    console.log("SERVER RUNNING:", PORT);

});
