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

// ===== TRANG CHÍNH =====
app.get("/", (req, res) => {

  let history = "";

  if (data.orders.length === 0) {

    history = `
      <div style="
        color:red;
        font-size:50px;
        margin-top:30px;
      ">
        CHƯA CÓ ĐƠN
      </div>
    `;

  } else {

    data.orders.forEach((o) => {

      history += `

      <div style="
        border-top:3px solid #333;
        margin-top:30px;
        padding-top:30px;
      ">

        <div style="
          color:yellow;
          font-size:40px;
        ">
          LOẠI
        </div>

        <div style="
          color:white;
          font-size:45px;
          margin-bottom:20px;
        ">
          ${o.type || ""}
        </div>

        <div style="
          color:cyan;
          font-size:40px;
        ">
          MÃ ĐƠN
        </div>

        <div style="
          color:white;
          font-size:45px;
          margin-bottom:20px;
        ">
          ${o.orderId || ""}
        </div>

        <div style="
          color:#00ff66;
          font-size:40px;
        ">
          SẢN PHẨM
        </div>

        <div style="
          color:white;
          font-size:45px;
          margin-bottom:20px;
        ">
          ${o.product || ""}
        </div>

        <div style="
          color:orange;
          font-size:40px;
        ">
          TRẠNG THÁI
        </div>

        <div style="
          color:white;
          font-size:45px;
          margin-bottom:20px;
        ">
          ${o.status || ""}
        </div>

      </div>

      `;
    });
  }

  res.send(`

  <html>

  <head>

    <title>NAMRICE AUTO</title>

    <meta name="viewport"
      content="width=device-width, initial-scale=1.0">

  </head>

  <body style="
    background:black;
    color:white;
    font-family:Arial;
    text-align:center;
    padding:20px;
  ">

    <div style="
      color:yellow;
      font-size:80px;
      font-weight:bold;
    ">
      NAMRICE AUTO
    </div>

    <div style="
      color:${data.paid ? "#00ff66" : "red"};
      font-size:60px;
      margin-top:30px;
      font-weight:bold;
    ">
      ${
        data.paid
          ? "ĐÃ THANH TOÁN"
          : "CHƯA THANH TOÁN"
      }
    </div>

    <div style="
      border:4px solid white;
      border-radius:25px;
      margin-top:40px;
      padding:30px;
    ">

      <div style="
        color:cyan;
        font-size:55px;
      ">
        MÁY
      </div>

      <div style="
        color:white;
        font-size:60px;
        margin-top:10px;
      ">
        ${data.machine.machineId}
      </div>

      <div style="
        color:#00ff66;
        font-size:40px;
        margin-top:30px;
        line-height:60px;
      ">
        ${data.machine.address}
      </div>

    </div>

    <div style="
      border:4px solid white;
      border-radius:25px;
      margin-top:40px;
      padding:30px;
    ">

      <div style="
        color:cyan;
        font-size:70px;
        font-weight:bold;
      ">
        Ô A1
      </div>

      <div style="
        color:yellow;
        font-size:45px;
        margin-top:30px;
      ">
        TRẠNG THÁI
      </div>

      <div style="
        color:${
          data.machine.slotA1.status === "LOCKED"
            ? "#00ff66"
            : "red"
        };
        font-size:65px;
        font-weight:bold;
        margin-top:10px;
      ">
        ${data.machine.slotA1.status}
      </div>

      <div style="
        color:yellow;
        font-size:45px;
        margin-top:30px;
      ">
        ĐƠN HÀNG
      </div>

      <div style="
        color:white;
        font-size:50px;
        margin-top:10px;
      ">
        ${
          data.machine.slotA1.orderId ||
          "KHÔNG CÓ"
        }
      </div>

      <div style="
        color:yellow;
        font-size:45px;
        margin-top:30px;
      ">
        SẢN PHẨM
      </div>

      <div style="
        color:#00ff66;
        font-size:50px;
        margin-top:10px;
      ">
        ${
          data.machine.slotA1.product ||
          "KHÔNG CÓ"
        }
      </div>

      <div style="
        color:yellow;
        font-size:45px;
        margin-top:30px;
      ">
        SỐ KG
      </div>

      <div style="
        color:orange;
        font-size:65px;
        margin-top:10px;
      ">
        ${data.machine.slotA1.kg} KG
      </div>

    </div>

    <div style="
      border:4px solid white;
      border-radius:25px;
      margin-top:40px;
      padding:30px;
    ">

      <div style="
        color:cyan;
        font-size:65px;
