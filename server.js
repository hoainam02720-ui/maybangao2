const express = require("express")
const cors = require("cors")
const axios = require("axios")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(__dirname))

const PORT = process.env.PORT || 3000

// ===== MÁY BÁN GẠO =====

const MACHINE = {
  name: "Máy bán gạo A4",
  address: "Đường A4 Cần Thơ",
  lat: 10.0452,
  lon: 105.7469
}

// ===== GIÁ =====

const PRICE = {

  // ĐẶT XE
  bike: 8000,
  car4: 13000,
  car7: 18000,

  // GIAO HÀNG
  truck500: 13000,
  truck1t: 18000,
  truck25: 22000,
  truck35: 26000,

  // GẠO
  rice: 8000
}

let orders = []

// ===== TÌM TOẠ ĐỘ =====

async function getLatLon(address){

  const url =
  "https://nominatim.openstreetmap.org/search?format=json&q="
  + encodeURIComponent(address)

  const response = await axios.get(url)

  if(!response.data.length){
    throw new Error("Không tìm được địa chỉ")
  }

  return {
    lat: parseFloat(response.data[0].lat),
    lon: parseFloat(response.data[0].lon)
  }
}

// ===== TÍNH KM =====

function distance(lat1, lon1, lat2, lon2){

  const R = 6371

  const dLat = (lat2-lat1) * Math.PI/180
  const dLon = (lon2-lon1) * Math.PI/180

  const a =
  Math.sin(dLat/2) * Math.sin(dLat/2)
  +
  Math.cos(lat1*Math.PI/180)
  *
  Math.cos(lat2*Math.PI/180)
  *
  Math.sin(dLon/2)
  *
  Math.sin(dLon/2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c
}

// ===== ĐẶT XE =====

app.post("/api/order/ride", async(req,res)=>{

  try{

    const {
      pickup,
      destination,
      vehicle
    } = req.body

    const p1 = await getLatLon(pickup)
    const p2 = await getLatLon(destination)

    const km = distance(
      p1.lat,
      p1.lon,
      p2.lat,
      p2.lon
    )

    const total =
    Math.round(km * PRICE[vehicle])

    const order = {

      id: Date.now(),

      type: "ride",

      pickup,
      destination,
      vehicle,

      km: km.toFixed(1),

      total,

      status: "Đang tìm tài xế",

      pickupLat: p1.lat,
      pickupLon: p1.lon,

      destinationLat: p2.lat,
      destinationLon: p2.lon
    }

    orders.push(order)

    res.json({
      success:true,
      order
    })

  }catch(err){

    res.status(500).json({
      success:false,
      message: err.message
    })

  }

})

// ===== GIAO HÀNG =====

app.post("/api/order/delivery", async(req,res)=>{

  try{

    const {
      pickup,
      destination,
      vehicle
    } = req.body

    const p1 = await getLatLon(pickup)
    const p2 = await getLatLon(destination)

    const km = distance(
      p1.lat,
      p1.lon,
      p2.lat,
      p2.lon
    )

    const total =
    Math.round(km * PRICE[vehicle])

    const order = {

      id: Date.now(),

      type: "delivery",

      pickup,
      destination,
      vehicle,

      km: km.toFixed(1),

      total,

      status: "Đang tìm shipper",

      pickupLat: p1.lat,
      pickupLon: p1.lon,

      destinationLat: p2.lat,
      destinationLon: p2.lon
    }

    orders.push(order)

    res.json({
      success:true,
      order
    })

  }catch(err){

    res.status(500).json({
      success:false,
      message: err.message
    })

  }

})

// ===== GIAO GẠO =====

app.post("/api/order/rice", async(req,res)=>{

  try{

    const {
      customerAddress,
      bags
    } = req.body

    const customer =
    await getLatLon(customerAddress)

    const km = distance(
      MACHINE.lat,
      MACHINE.lon,
      customer.lat,
      customer.lon
    )

    const ship =
    Math.round(km * PRICE.rice)

    const riceMoney =
    bags * 5 * 22000

    const total =
    riceMoney + ship

    const order = {

      id: Date.now(),

      type: "rice",

      bags,

      customerAddress,

      km: km.toFixed(1),

      total,

      status: "Đang chờ shipper",

      machineAddress: MACHINE.address,

      machineLat: MACHINE.lat,
      machineLon: MACHINE.lon,

      customerLat: customer.lat,
      customerLon: customer.lon
    }

    orders.push(order)

    res.json({
      success:true,
      order
    })

  }catch(err){

    res.status(500).json({
      success:false,
      message: err.message
    })

  }

})

// ===== DANH SÁCH ĐƠN =====

app.get("/api/orders",(req,res)=>{

  res.json(orders)

})

// ===== ESP32 =====

app.get("/mo",(req,res)=>{

  console.log("ESP32 OPEN")

  res.send("OK")

})

// ===== HOME =====

app.get("/",(req,res)=>{

  res.sendFile(path.join(__dirname,"index.html"))

})

// ===== START =====

app.listen(PORT,()=>{

  console.log("NAMRICE AUTO RUNNING")

})
