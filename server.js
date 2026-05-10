const express = require("express");

const app = express();

app.use(express.json());

let trangThai = "OFF";

app.get("/", (req, res) => {
  res.send("Máy bán gạo đang chạy 😄");
});

app.post("/webhook", (req, res) => {

  console.log(req.body);

  trangThai = "ON";

  res.send("Đã nhận thanh toán");

});

app.get("/status", (req, res) => {

  res.send(trangThai);

  trangThai = "OFF";

});

app.listen(8080, () => {
  console.log("Server chạy cổng 8080");
});
