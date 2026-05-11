const express = require("express");
const app = express();

app.use(express.json());

let data = {
  paid: false,

  machine: {
    machineId: "MAY01",

    address:
      "185 tổ 8 ấp Đông Thạnh xã Đông Thạnh Bình Minh Vĩnh Long",

    slotA1: {
      status: "EMPTY",
      orderId: null,
      product: null,
      kg: 0,
    },
  },

  orders: [],
};

// WEB CHÍNH
app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>NAMRICE AUTO</title>

    <style>
      body{
        background:black;
        color:white;
        font-family:Arial;
        text-align:center;
        padding:20px;
      }

      h1{
        color:yellow;
        font-size:60px;
      }

      .paid{
        color:#00ff66;
        font-size:45px;
      }

      .unpaid{
        color:red;
        font-size:45px;
      }

      .box{
        border:3px solid white;
        border-radius:20px;
        padding:20px;
        margin-top:20px;
      }

      .blue{
        color:cyan;
        font-size:40px;
      }

      .text{
        font-size:30px;
        margin-top:15px;
      }

      .history{
        text-align:left;
        font-size:22px;
        white-space:pre-wrap;
      }
    </style>
  </head>

  <body>

    <h1>NAMRICE AUTO</h1>

    <div class="${
      data.paid ? "paid" : "unpaid"
    }">
      ${
        data.paid
          ? "ĐÃ THANH TOÁN"
          : "CHƯA THANH TOÁN"
      }
    </div>

    <div class="text">
      Máy: ${data.machine.machineId}
    </div>

    <div class="text">
      ${data.machine.address}
    </div>

    <div class="box">

      <div class="blue">
        Ô A1
      </div>

      <div class="text">
        Trạng thái:
        ${data.machine.slotA1.status}
      </div>

      <div class="text">
        Đơn hàng:
        ${
          data.machine.slotA1.orderId ||
          "Không có"
        }
      </div>

      <div class="text">
        Sản phẩm:
        ${
          data.machine.slotA1.product ||
          "Không có"
        }
      </div>

      <div class="text">
        Kg:
        ${data.machine.slotA1.kg}
      </div>

    </div>

    <div class="box">

      <div class="blue">
        LỊCH SỬ ĐƠN
      </div>

      <div class="history">
${JSON.stringify(data.orders, null, 2)}
      </div>

    </div>

  </body>
  </html>
  `);
});

// XEM DỮ LIỆU JSON
app.get("/data", (req, res) => {
  res.json(data);
});

// WEBHOOK SEPAY
app.post("/webhook", (req, res) => {
  console.log("Webhook:");
  console.log(req.body);

  data.paid = true;

  data.orders.push({
    type: "BANK",
    amount: req.body?.content?.transferAmount || 0,
    time: new Date(),
    raw: req.body,
  });

  setTimeout(() => {
    data.paid = false;
  }, 300000);

  res.status(200).send("ok");
});

// GIẢ LẬP ĐƠN TIKTOK
app.get("/fake-tiktok", (req, res) => {
  const orderId =
    "TK" + Math.floor(Math.random() * 100000);

  data.machine.slotA1 = {
    status: "LOCKED",
    orderId: orderId,
    product: "Gạo ST25",
    kg: 5,
  };

  data.orders.push({
    type: "TIKTOK",
    orderId: orderId,
    product: "Gạo ST25",
    kg: 5,
    status: "CHỜ SHIPPER",
    time: new Date(),
  });

  res.send("Đã tạo đơn TikTok");
});

// SHIPPER ĐÃ LẤY HÀNG
app.get("/picked", (req, res) => {
  const orderId =
    data.machine.slotA1.orderId;

  data.orders.push({
    type: "SYSTEM",
    message:
      "Shipper đã lấy hàng " + orderId,
    time: new Date(),
  });

  data.machine.slotA1 = {
    status: "EMPTY",
    orderId: null,
    product: null,
    kg: 0,
  };

  res.send("Đã mở khóa kho");
});

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server chạy");
});
