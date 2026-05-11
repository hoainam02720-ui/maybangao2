const express = require("express");
const app = express();

app.use(express.json());

// =====================
// TRẠNG THÁI
// =====================

let paid = false;

let machine = {
  machineId: "MAY01",
  address: "185 tổ 8 ấp Đông Thạnh xã Đông Thạnh Bình Minh Vĩnh Long",

  slotA1: {
    status: "EMPTY", // EMPTY / RESERVED / OPEN
    orderId: null,
    product: null,
    kg: 0
  }
};

// =====================
// TRANG CHÍNH
// =====================

app.get("/", (req, res) => {

  res.json({
    paid,
    machine
  });

});

// =====================
// ESP32 ĐỌC TRẠNG THÁI
// =====================

app.get("/machine", (req, res) => {

  res.json(machine);

});

// =====================
// SHIPPER ĐÃ NHẬN HÀNG
// =====================

app.get("/shipper-picked", (req, res) => {

  if (machine.slotA1.status === "RESERVED") {

    console.log("SHIPPER ĐÃ NHẬN HÀNG");

    // mở kho
    machine.slotA1.status = "OPEN";

    console.log("MỞ KHÓA Ô A1");

  }

  res.send("OK");

});

// =====================
// RESET Ô
// =====================

app.get("/reset", (req, res) => {

  machine.slotA1 = {
    status: "EMPTY",
    orderId: null,
    product: null,
    kg: 0
  };

  console.log("RESET Ô A1");

  res.send("RESET OK");

});

// =====================
// WEBHOOK
// =====================

app.post("/webhook", (req, res) => {

  console.log("WEBHOOK:");
  console.log(req.body);

  // =====================================
  // SEPAY
  // =====================================

  if (req.body.transferType) {

    console.log("KHÁCH CHUYỂN KHOẢN");

    paid = true;

    setTimeout(() => {
      paid = false;
    }, 300000);

  }

  // =====================================
  // TIKTOK CÓ ĐƠN
  // =====================================

  if (
    req.body.type === "ORDER_PAID" ||
    req.body.order_status === "UNPAID"
  ) {

    console.log("CÓ ĐƠN TIKTOK");

    machine.slotA1.status = "RESERVED";

    machine.slotA1.orderId =
      req.body.order_id || "TT123";

    machine.slotA1.product =
      "ST25";

    machine.slotA1.kg =
      5;

    console.log("KHÓA Ô A1");

  }

  // =====================================
  // SHIPPER ĐÃ NHẬN
  // =====================================

  if (
    req.body.order_status === "PICKED_UP"
  ) {

    console.log("SHIPPER ĐÃ NHẬN ĐƠN");

    machine.slotA1.status = "OPEN";

    console.log("IN BILL");

    console.log("MỞ KHÓA A1");

  }

  res.status(200).send("OK");

});

// =====================
// CHẠY SERVER
// =====================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log("NamRice Auto chạy");

});
