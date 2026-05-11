const express=require("express")
const app=express()

app.use(express.json())

let orders=[]

let machine={
lock:true
}

app.get("/",(req,res)=>{

let html=orders.map(o=>`
<div style="border:3px solid yellow;margin:20px;padding:20px">

<div style="font-size:50px;color:cyan">
${o.type}
</div>

<div style="font-size:35px">
${o.id}
</div>

<div style="font-size:35px;color:lime">
${o.money}đ
</div>

</div>
`).join("")

res.send(`
<body style="background:black;color:white">

<div style="font-size:70px;color:yellow">
NAMRICE AUTO
</div>

<div style="font-size:55px;color:lime">
${machine.lock?"ĐANG KHÓA":"ĐÃ MỞ KHÓA"}
</div>

${html}

</body>
`)
})

app.get("/machine",(req,res)=>{

res.json(machine)

})

app.post("/sepay",(req,res)=>{

let data=req.body

orders.unshift({
type:"SEPAY",
id:data.content || "KHACH",
money:data.transferAmount || 0
})

res.send("OK")
})

app.post("/tiktok",(req,res)=>{

let data=req.body

machine.lock=true

orders.unshift({
type:"TIKTOK",
id:data.order_id || "DONMOI",
money:data.price || 0
})

res.send("OK")
})

app.post("/picked",(req,res)=>{

machine.lock=false

res.send("OPEN")
})

app.listen(process.env.PORT || 3000)
