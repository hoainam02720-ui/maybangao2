const express = require("express")
const axios = require("axios")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("./"))

const PORT = process.env.PORT || 3000

// =========================
// GIÁ
// =========================

const PRICE = {

bike: 8000,

car4: 13000,

car7: 18000,

truck500: 13000,

truck1t: 18000,

truck25: 22000,

truck35: 26000

}

// =========================
// MÁY BÁN GẠO
// =========================

const MACHINE = {

name: "Máy bán gạo A4",

address: "Đường A4 Cần Thơ",

lat: 10.0452,

lon: 105.7469

}

// =========================
// LẤY TỌA ĐỘ
// =========================

async function getLatLon(address){

const url =
`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`

const response = await axios.get(url,{
headers:{
"User-Agent":"NamRiceAuto"
}
})

if(!response.data.length){

throw new Error("Không tìm thấy địa chỉ")

}

return {

lat: parseFloat(response.data[0].lat),

lon: parseFloat(response.data[0].lon)

}

}

// =========================
// TÍNH KM THẬT
// =========================

async function getDistance(lat1,lon1,lat2,lon2){

const R = 6371

const dLat = (lat2-lat1) * Math.PI / 180

const dLon = (lon2-lon1) * Math.PI / 180

const a =
Math.sin(dLat/2) * Math.sin(dLat/2) +
Math.cos(lat1 * Math.PI/180) *
Math.cos(lat2 * Math.PI/180) *
Math.sin(dLon/2) * Math.sin(dLon/2)

const c = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a))

return R * c

}

// =========================
// ĐẶT XE
// =========================

app.post("/api/order/ride", async(req,res)=>{

try{

const {
pickup,
destination,
vehicle
} = req.body

const p1 = await getLatLon(pickup)

const p2 = await getLatLon(destination)

const km = await getDistance(
p1.lat,
p1.lon,
p2.lat,
p2.lon
)

const total =
Math.round(km * PRICE[vehicle])

res.json({

success:true,

order:{

pickupLat:p1.lat,
pickupLon:p1.lon,

destinationLat:p2.lat,
destinationLon:p2.lon,

km:km.toFixed(1),

total,

status:"Đang tìm tài xế"

}

})

}catch(err){

res.status(500).json({

success:false,

message:err.message

})

}

})

// =========================
// GIAO HÀNG
// =========================

app.post("/api/order/delivery", async(req,res)=>{

try{

const {
pickup,
destination,
vehicle
} = req.body

const p1 = await getLatLon(pickup)

const p2 = await getLatLon(destination)

const km = await getDistance(
p1.lat,
p1.lon,
p2.lat,
p2.lon
)

const total =
Math.round(km * PRICE[vehicle])

res.json({

success:true,

order:{

pickupLat:p1.lat,
pickupLon:p1.lon,

destinationLat:p2.lat,
destinationLon:p2.lon,

km:km.toFixed(1),

total,

status:"Shipper đang lấy hàng"

}

})

}catch(err){

res.status(500).json({

success:false,

message:err.message

})

}

})

// =========================
// GIAO GẠO
// =========================

app.post("/api/order/rice", async(req,res)=>{

try{

const {
customerAddress,
bags
} = req.body

const customer =
await getLatLon(customerAddress)

const km = await getDistance(
MACHINE.lat,
MACHINE.lon,
customer.lat,
customer.lon
)

const ricePrice =
parseInt(bags) * 5 * 22000

const shipFee =
Math.round(km * PRICE.bike)

const total =
ricePrice + shipFee

res.json({

success:true,

order:{

machineLat:MACHINE.lat,
machineLon:MACHINE.lon,

customerLat:customer.lat,
customerLon:customer.lon,

bags,

km:km.toFixed(1),

total,

status:"Đang giao gạo"

}

})

}catch(err){

res.status(500).json({

success:false,

message:err.message

})

}

})

// =========================
// CHẠY SERVER
// =========================

app.listen(PORT,()=>{

console.log("NAMRICE AUTO RUNNING")

})
