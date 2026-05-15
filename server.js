const express = require("express")
const app = express()

app.use(express.json())
app.use(express.static(__dirname))

let donhang = []

let shipperWallet = 245000

// TRANG CHU

app.get("/", (req,res)=>{

res.sendFile(__dirname + "/index.html")

})

// TAO DON

app.post("/taodon",(req,res)=>{

const data = req.body

const id = Date.now()

const don = {

id:id,

type:data.type,

phone:data.phone,

pickup:data.pickup,

destination:data.destination,

rice:data.rice,

kg:data.kg,

vehicle:data.vehicle,

distance:data.distance,

total:data.total,

status:"dangcho"

}

donhang.push(don)

res.json({

ok:true,
don:don

})

})

// LAY DON

app.get("/donhang",(req,res)=>{

const doncho = donhang.filter(
d => d.status == "dangcho"
)

res.json(doncho)

})

// NHAN DON

app.post("/nhandon/:id",(req,res)=>{

const id = Number(req.params.id)

const don = donhang.find(
d => d.id == id
)

if(!don){

return res.json({
ok:false
})

}

don.status = "danhan"

res.json({
ok:true,
don:don
})

})

// DA DEN

app.post("/daden/:id",(req,res)=>{

const id = Number(req.params.id)

const don = donhang.find(
d => d.id == id
)

if(!don){

return res.json({
ok:false
})

}

don.status = "daden"

res.json({
ok:true
})

})

// MO ESP32

app.get("/mo",(req,res)=>{

console.log("ESP32 MO KHOA")

res.send("OK")

})

// DI GIAO

app.post("/digiao/:id",(req,res)=>{

const id = Number(req.params.id)

const don = donhang.find(
d => d.id == id
)

if(!don){

return res.json({
ok:false
})

}

don.status = "dangiao"

res.json({
ok:true
})

})

// HOAN THANH

app.post("/hoanthanh/:id",(req,res)=>{

const id = Number(req.params.id)

const don = donhang.find(
d => d.id == id
)

if(!don){

return res.json({
ok:false
})

}

don.status = "hoanthanh"

const total = Number(don.total)

const hoahong = total * 0.15

const phihethong = total * 0.015

const shipperNhan =

total - hoahong - phihethong

shipperWallet += shipperNhan

res.json({

ok:true,

wallet:shipperWallet,

shipperNhan:shipperNhan

})

})

// VI SHIPPER

app.get("/wallet",(req,res)=>{

res.json({

wallet:shipperWallet

})

})

app.listen(3000,()=>{

console.log("NAMRICE AUTO RUNNING")

})
