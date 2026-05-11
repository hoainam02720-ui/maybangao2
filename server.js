const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

const DATA_FILE = "data.json";

// =======================
// TẠO DATA MẶC ĐỊNH
// =======================

let systemData = {
  paid: false,

  machine: {
    machineId: "MAY01",

    address:
      "185 tổ 8 ấp Đông Thạnh xã Đông Thạnh Bình Minh Vĩnh Long",

    slotA1: {
      status: "EMPTY",
      orderId: null,
      product: null,
      kg: 0
    }
  },

  orders: []
};

// =======================
// ĐỌC FILE NẾU CÓ
// =======================

if (fs.existsSync(DATA_FILE)) {
  const raw = fs.readFileSync(DATA_FILE);

  systemData = JSON.parse(raw);
}

// =======================
// HÀM LƯU FILE
// =======================

function saveData() {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(systemData, null, 2)
  );
}

// =======================
// TRANG WEB
// =======================

app.get("/", (req, res) => {

  const statusColor =
    systemData.paid ? "green" : "red";

  const statusText =
    systemData.paid
      ? "ĐÃ THANH TOÁN"
      : "CHƯA THANH TOÁN";

  res.send(`
  <html>

  <body style="
    background:black;
    color:white;
    font-family:Arial;
    text-align:center;
    padding-top:50px;
  ">

    <h1 style="
      font-size:60px;
      color:yellow;
    ">
      NAMRICE AUTO
    </h1>

    <h2 style="
      font-size:50px;
      color:${statusColor};
    ">
      ${statusText}
    </h2>

    <p style="font-size:35px;">
      Máy:
      ${systemData.machine.machineId}
    </p>

    <p style="font-size:28px;">
      ${systemData.machine.address}
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

      <h2 style="
        font-size:40px;
        color:cyan;
      ">
        Ô A1
      </h2>

      <p style="font-size:35px;">
        Trạng thái:
        ${systemData.machine.slotA1.status}
      </p>

      <p style="font-size:30px;">
        Đơn hàng:
        ${
          systemData.machine.slotA1.orderId ||
          "Không có"
        }
      </p>

    </div>

  </body>
  </html>
  `);
});

// =======================
// WEBHOOK
// =======================

app.post("/webhook", (req, res) => {

  console.log("Webhook:");
  console.log(req.body);

  systemData.paid = true;

  // tạo đơn mới
  const order = {
    id: Date.now(),

    amount:
      req.body.content || "Không rõ",

    time:
      new Date().toLocaleString()
  };

  systemData.orders.push(order);

  // cập nhật ô A1
  systemData.machine.slotA1.status =
    "RESERVED";

  systemData.machine.slotA1.orderId =
    order.id;

  systemData.machine.slotA1.product =
    "Gạo ST25";

  systemData.machine.slotA1.kg = 5;

  saveData();

  setTimeout(() => {

    systemData.paid = false;

    saveData();

  }, 300000);

  res.status(200).send("ok");
});

// =======================
// XEM DỮ LIỆU JSON
// =======================

app.get("/data", (req, res) => {

  res.json(systemData);

});

// =======================

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log("Server chạy");

});
