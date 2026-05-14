const express = require("express")
const path = require("path")



const fetch = (...args) =>
  import('node-fetch').then(({default: fetch}) => fetch(...args))

const app = express()


app.use(express.static(__dirname))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})
let donHang = []

app.get("/donhang", (req, res) => {
res.json(donHang)
})

app.post("/sepay", express.json(), async (req, res) => {

  const data = req.body

  console.log(data)

  const amount = Number(data.transferAmount || 0)

  const content = String(data.content || "").toLowerCase()

  if (
    amount >= 2000 &&
    content.includes("may gao st25 01")
  ) {

    try {

      await fetch("http://192.168.1.14/mo")

      console.log("DA MO MAY")

    } catch (err) {

      console.log(err)

    }

  }

  res.json({
    ok: true
  })

})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})
