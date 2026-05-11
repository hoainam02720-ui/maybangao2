const express = require("express");
const app = express();

app.use(express.json());

let paid = false;

const machine = {
  machineId: "MAY01",
  address: "185 tổ 8 ấp Đông Thạnh xã Đông Thạnh Bình Minh Vĩnh Long",
  slotA1: {
    status: "EMPTY",
    orderId: null,
    product: null,
    kg: 0
  }
};

// Trang chính
app.get("/", (req, res) => {

  const statusColor = paid ? "green" : "red";
  const statusText = paid ? "ĐÃ THANH TOÁN" : "CHƯA THANH TOÁN";

  res.send(`
  <html>
    <head>
      <title>NamRice Auto</title>
    </head>

    <body style="
      background:black;
      color:white;
      font-family:Arial;
      text-align:center;
      padding-top:50px;
    ">

      <h1 style="font-size:60px;color:yellow;">
        NAMRICE AUTO
      </h1>

      <h2 style="
        font-size:50px;
        color:${statusColor};
      ">
        ${statusText}
      </h2>

      <p style="font-size:35px;">
        Máy: ${machine.machineId}
      </p>

      <p style="font-size:28px;">
        ${machine.address}
      </p>

      <div style="
        margin-top:40px;
        border:3px solid white;
        padding:20px;
        width:80%;
        margin-left:auto;
        margin-right:auto;
        border-radius:20px;
      ">

        <h2 style="font-size:40px;color:cyan;">
          Ô A1
        </h2>

        <p style="font-size:35px;">
          Trạng thái: ${machine.slotA1.status}
        </p>

        <p style="font-size:30px;">
          Đơn hàng: ${machine.slotA1.orderId || "Không có"}
        </p>

      </div>

    </body>
  </html>
  `);
});

// Webhook
app.post("/webhook", (req, res) => {

  console.log("Webhook:");
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
