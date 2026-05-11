const express = require("express");
const app = express();

app.use(express.json());

let paid = false;

let machine = {
  machineId: "MAY01",
  address: "185 tổ 8 ấp Đông Thạnh xã Đông Thạnh Bình Minh Vĩnh Long",
  slotA1: {
    status: "EMPTY",
    orderId: null,
    product: null,
    kg: 0
  }
};

let orders = [];

app.get("/", (req, res) => {

  let html = `
  <html>
  <head>
    <meta charset="UTF-8">
    <title>NAMRICE AUTO</title>
  </head>

  <body style="
    background:black;
    color:white;
    font-family:Arial;
    text-align:center;
    padding:30px;
  ">

    <h1 style="
      color:yellow;
      font-size:70px;
    ">
      NAMRICE AUTO
    </h1>

    <h2 style="
      color:${paid ? "lime" : "red"};
      font-size:55px;
    ">
      ${paid ? "ĐÃ THANH TOÁN" : "CHƯA THANH TOÁN"}
    </h2>

    <h3 style="font-size:45px;">
      Máy: ${machine.machineId}
    </h3>

    <p style="
      font-size:30px;
      margin-bottom:50px;
    ">
      ${machine.address}
    </p>

    <div style="
      border:4px solid white;
      border-radius:20px;
      padding:30px;
      margin:auto;
      width:80%;
    ">

      <h2 style="
        color:cyan;
        font-size:55px;
      ">
        Ô A1
      </h2>

      <p style="font-size:40px;">
        Trạng thái:
        ${machine.slotA1.status}
      </p>

      <p style="font-size:35px;">
        Đơn hàng:
        ${machine.slotA1.orderId || "Không có"}
      </p>

    </div>

    <br><br>

    <h2 style="
      color:orange;
      font-size:55px;
    ">
      LỊCH SỬ ĐƠN
    </h2>

    ${orders.map(order => `
      <div style="
        border:3px solid gray;
        margin:20px;
        padding:20px;
        border-radius:15px;
      ">

        <p style="font-size:35px;">
          Mã đơn:
          ${
