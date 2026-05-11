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

const orders = [];

app.get("/", (req, res) => {

  const orderHtml = orders.map(o => `
    <div style="
      border:3px solid yellow;
      border-radius:20px;
      padding:25px;
      margin-top:30px;
      background:black;
    ">
      <div style="
        color:cyan;
        font-size:45px;
        font-weight:bold;
      ">
        ĐƠN TIKTOK
      </div>

      <div style="
        color:white;
        font-size:35px;
        margin-top:15px;
      ">
        Mã đơn: ${o.id}
      </div>

      <div style="
        color:lime;
        font-size:35px;
        margin-top:15px;
      ">
        Sản phẩm: ${o.product}
      </div>

      <div style="
        color:orange;
        font-size:35px;
        margin-top:15px;
      ">
        Khối lượng: ${o.kg} KG
      </div>

      <div style="
        color:red;
        font-size:40px;
        margin-top:20px;
        font-weight:bold;
      ">
        ĐÃ KHÓA Ô GẠO CHỜ SHIPPER
      </div>
    </div>
  `).join("");

  res.send(`
  <html>
  <body style="
    background:black;
    color:white;
    font-family:Arial;
    text-align:center;
    padding:30px;
  ">

    <div style="
      color:yellow;
      font-size:65px;
      font-weight:bold;
    ">
      NAMRICE AUTO
    </div>

    <div style="
      color:${paid ? "lime" : "red"};
      font-size:55px;
      margin-top:30px;
      font-weight:bold;
    ">
      ${paid ? "ĐÃ THANH TOÁN" : "CHƯA THANH TOÁN"}
    </div>

    <div style="
      font-size:40px;
      margin-top:30px;
    ">
      Máy: ${machine.machineId}
    </div>

    <div style="
      font-size:32px;
      margin-top:20px;
      color:#ddd;
    ">
      ${machine.address}
    </div>

    <div style="
      border:4px solid white;
      border-radius:25px;
      padding:30px;
      margin-top:40px;
    ">

      <div style="
        color:cyan;
        font-size:55px;
        font-weight:bold;
      ">
        Ô A1
      </div>

      <div style="
        font-size:40px;
        margin-top:25px;
      ">
        Trạng thái: ${machine.slotA1.status}
      </div>

      <div style="
        font-size:35px;
        margin-top:20px;
      ">
        Đơn hàng: ${machine.slotA1.orderId || "Không có"}
      </div>

    </div>

    ${orderHtml}

  </body>
  </html>
  `);
});

app.get("/fake-tiktok", (req, res) => {

  const order = {
    id: "TT" + Date.now(),
    product: "GẠO ST25",
    kg: 5
  };

  orders.push(order);

  machine.slotA1.status = "LOCKED";
  machine.slotA1.orderId = order.id;
  machine.slotA1.product = order.product;
  machine.slotA1.kg = order.kg;

  res.send(`
    <html>
    <body style="
      background:black;
      color:lime;
      font-size:60px;
      text-align:center;
      padding-top:150px;
      font-family:Arial;
      font-weight:bold;
    ">
      ĐÃ TẠO ĐƠN TIKTOK
    </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("NAMRICE AUTO RUNNING");
});
