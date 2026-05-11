const express = require("express");
const app = express();

app.use(express.json());

let paid = false;
let lastData = null;

// Trang chính
app.get("/", (req, res) => {
  res.send(paid ? "ON" : "OFF");
});

// API cho ESP32 đọc
app.get("/status", (req, res) => {
  res.json({
    paid: paid,
    data: lastData
  });
});

// Webhook TikTok + SePay
app.post("/webhook", (req, res) => {

  console.log("Webhook nhận:");
  console.log(req.body);

  lastData = req.body;

  paid = true;

  // tự tắt sau 5 phút
  setTimeout(() => {
    paid = false;
  }, 300000);

  res.status(200).send("ok");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server chạy");
});
