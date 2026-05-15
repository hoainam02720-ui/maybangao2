const express = require("express")

const app = express()

app.use(express.json())
app.use(express.static(__dirname))

let coLenhMo = false
let daMo = false

// WEBHOOK SEPAY
app.post("/sepay", (req, res) => {

  const data = req.body

  const amount = Number(data.transferAmount || 0)

  const content = String(
    data.content || ""
  ).toLowerCase()

  console.log(data)

  if (
    amount >= 2000 &&
    content.includes("may gao st25 01")
  ) {

    console.log("MO KHOA")

    coLenhMo = true
  }

  res.json({
    success: true
  })
})

// ESP32 CHECK LENH
app.get("/check", (req, res) => {

  if (coLenhMo) {

    coLenhMo = false

    res.send("OPEN")

  } else {

    res.send("NONE")
  }
})

// ESP32 BAO DA MO
app.get("/damo", (req, res) => {

  daMo = true

  console.log("ESP32 DA MO KHOA")

  res.send("OK")
})

// WEB XEM TRANG THAI
app.get("/trangthai", (req, res) => {

  if (daMo) {

    daMo = false

    res.send("DA MO KHOA")

  } else {

    res.send("DANG KHOA")
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {

  console.log("NAMRICE SERVER OK")
})
