const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Máy bán gạo online hoạt động 😄");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server đang chạy cổng " + PORT);
});
