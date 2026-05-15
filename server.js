// =========================
// NAMRICE AUTO SERVER
// =========================

const express = require("express")

const app = express()

app.use(express.json())

app.use(express.static(__dirname))

app.get("/", (req, res) => {

  res.sendFile(__dirname + "/index.html")
})

// =========================
// DU LIEU
// =========================

let coLenhMo = false

let donHang = []

let shipper = []

// =========================
// TAO DON
// =========================

app.post("/taodon", (req, res) => {

  const data = req.body

  const id =
    "NR" + Date.now()

  data.id = id

  data.trangThai =
    "CHO_SHIPPER"

  donHang.push(data)

  console.log("TAO DON")

  console.log(data)

  res.json({
    success: true,
    id
  })
})

// =========================
// DANH SACH DON
// =========================

app.get("/donhang", (req, res) => {

  res.json(donHang)
})

// =========================
// SHIPPER NHAN DON
// =========================

app.post("/nhandon", (req, res) => {

  const id = req.body.id

  const tenShipper =
    req.body.shipper

  const don = donHang.find(
    x => x.id == id
  )

  if (don) {

    don.shipper =
      tenShipper

    don.trangThai =
      "DANG_DI_LAY_GAO"
  }

  res.json({
    success: true
  })
})

// =========================
// SHIPPER DEN NOI
// =========================

app.post("/dadennhan", (req, res) => {

  const id = req.body.id

  const don = donHang.find(
    x => x.id == id
  )

  if (don) {

    don.trangThai =
      "DA_DEN_NOI_LAY_GAO"
  }

  res.json({
    success: true
  })
})

// =========================
// MO MAY LAY GAO
// =========================

app.post("/molaygao", (req, res) => {

  const id = req.body.id

  const don = donHang.find(
    x => x.id == id
  )

  if (don) {

    coLenhMo = true

    don.trangThai =
      "DANG_LAY_GAO"
  }

  res.json({
    success: true
  })
})

// =========================
// ESP32 CHECK LENH
// =========================

app.get("/check", (req, res) => {

  if (coLenhMo) {

    coLenhMo = false

    res.send("OPEN")

  } else {

    res.send("NONE")
  }
})

// =========================
// ESP32 BAO DA MO
// =========================

app.get("/damo", (req, res) => {

  console.log("ESP32 DA MO")

  res.send("OK")
})

// =========================
// SHIPPER LAY GAO XONG
// =========================

app.post("/laygaoxong", (req, res) => {

  const id = req.body.id

  const don = donHang.find(
    x => x.id == id
  )

  if (don) {

    don.trangThai =
      "DANG_GIAO_HANG"
  }

  res.json({
    success: true
  })
})

// =========================
// SHIPPER DEN KHACH
// =========================

app.post("/denkhach", (req, res) => {

  const id = req.body.id

  const don = donHang.find(
    x => x.id == id
  )

  if (don) {

    don.trangThai =
      "DA_DEN_KHACH"
  }

  res.json({
    success: true,

    tienCanThu:
      don.tongTien
  })
})

// =========================
// HOAN THANH DON
// =========================

app.post("/hoanthanh", (req, res) => {

  const id = req.body.id

  const don = donHang.find(
    x => x.id == id
  )

  if (don) {

    don.trangThai =
      "DA_GIAO"

    const phiShip =
      Number(don.tienShip || 0)

    const hoaHong =
      phiShip * 0.15

    const phiHeThong =
      phiShip * 0.015

    const shipperNhan =
      phiShip -
      hoaHong -
      phiHeThong

    don.tienShipper =
      shipperNhan
  }

  res.json({
    success: true
  })
})

// =========================
// WEBHOOK SEPAY
// =========================

app.post("/sepay", (req, res) => {

  const data = req.body

  console.log(data)

  res.json({
    success: true
  })
})

// =========================
// PORT
// =========================

const PORT =
  process.env.PORT || 3000

app.listen(PORT, () => {

  console.log(
    "NAMRICE SERVER OK"
  )
})
