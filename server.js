const express = require("express")
const path = require("path")

const app = express()

app.use(express.json())
app.use(express.static(__dirname))

app.get("/", (req,res)=>{
res.sendFile(path.join(__dirname,"index.html"))
})

app.get("/mo",(req,res)=>{

console.log("ESP32 MỞ KHÓA")

res.send("OK")

})

const PORT = process.env.PORT || 3000

app.listen(PORT,"0.0.0.0",()=>{

console.log("NAMRICE AUTO RUNNING")

})
