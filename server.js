const express = require("express")
const cors = require("cors")
const axios = require("axios")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

const PORT = process.env.PORT || 3000

let orders = []

const MACHINE = {
  name: "Máy bán gạo A4",
  lat: 10.0452,
  lon: 105.7469
}

const PRICE = {
  bike: 8000,
  truck500: 13000,
  truck1t: 18000,
  truck25: 22000,
  truck35: 26000,
  car4: 13000,
  car7: 18000,
  rice: 8000
}

async function getLatLon(address){

  const url =
  "https://nominatim.openstreetmap.org/search?format=json&q="
  + encodeURIComponent(address)

  const res = await axios.get(url)

  if(!res.data.length){
    throw new Error("Không tìm được địa chỉ")
  }

  return {
    lat: parseFloat(res.data[0].lat),
    lon: parseFloat(res.data[0].lon)
  }
}

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

app.post("/api/order/rice", async(req,res)=>{

  try{

    const { customerAddress, bags } = req.body

    const customer = await getLatLon(customerAddress)

    const km = distance(
      MACHINE.lat,
      MACHINE.lon,
      customer.lat,
      customer.lon
    )

    const ship = Math.round(km * PRICE.rice)

    const riceMoney = bags * 5 * 22000

    const total = riceMoney + ship

    const order = {
      id: Date.now(),
      type: "rice",
      bags,
      customerAddress,
      km: km.toFixed(1),
      total,
      status: "Đang chờ shipper",
      machine: MACHINE
    }

    orders.push(order)

    res.json({
      success:true,
      order
    })

  }catch(err){

    res.status(500).json({
      success:false,
      message:err.message
    })

  }

})

app.post("/api/order/ride", async(req,res)=>{

  try{

    const { pickup, destination, vehicle } = req.body

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
      type:"ride",
      pickup,
      destination,
      vehicle,
      km: km.toFixed(1),
      total,
      status:"Đang chờ tài xế"
    }

    orders.push(order)

    res.json({
      success:true,
      order
    })

  }catch(err){

    res.status(500).json({
      success:false,
      message:err.message
    })

  }

})

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
      type:"delivery",
      pickup,
      destination,
      vehicle,
      km: km.toFixed(1),
      total,
      status:"Đang giao hàng"
    }

    orders.push(order)

    res.json({
      success:true,
      order
    })

  }catch(err){

    res.status(500).json({
      success:false,
      message:err.message
    })

  }

})

app.get("/api/orders",(req,res)=>{
  res.json(orders)
})

app.get("/mo",(req,res)=>{
  console.log("ESP32 OPEN")
  res.send("OK")
})

app.listen(PORT,()=>{

  console.log("NAMRICE AUTO RUNNING")

})
