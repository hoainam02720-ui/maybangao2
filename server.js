const express = require("express");
const app = express();

app.use(express.json());

let paid = false;

// Trang chính
app.get("/", (req, res) => {
  res.send(paid ? "ON" : "OFF");
});

// Nhận webhook từ SePay
app.post("/webhook", (req, res) => {
  console.log(req.body);

  paid = true;

  setTimeout(() => {
    paid = false;
  }, 300000);

  res.status(200).send("ok");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server chạy");
});
