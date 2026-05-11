const express = require("express")
const app = express()

let locked = true

app.get("/", (req, res) => {

res.send(`
<body style="background:black;color:white">

<div style="font-size:70px;color:yellow">
NAMRICE AUTO
</div>

<div style="font-size:55px;color:lime">
${locked ? "ĐANG KHÓA" : "ĐÃ MỞ KHÓA"}
</div>

<div style="font-size:40px">
MÁY MAY01
</div>

<div style="font-size:30px">
185 TỔ 8 ẤP ĐÔNG THẠNH
</div>

</body>
`)

})

app.get("/picked", (req, res) => {

locked = false

res.send("DA MO KHOA")

})

app.get("/lock", (req, res) => {

locked = true

res.send("DA KHOA")

})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
console.log("Server running")
})
