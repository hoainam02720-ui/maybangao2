const express = require("express")
const path = require("path")

const app = express()

app.use(express.static(__dirname))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})
let donHang = []

app.get("/donhang", (req, res) => {
res.json(donHang)
})

app.post("/datgao", express.json(), (req, res) => {

donHang.push(req.body)

res.json({
ok: true
})

})
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})
