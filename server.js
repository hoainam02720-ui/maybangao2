const express=require("express")
const app=express()

let orders=[]

app.get("/",(req,res)=>{

let html=orders.map(o=>`
<div style="border:3px solid yellow;margin:20px;padding:20px">

<div style="font-size:50px;color:cyan">
ĐƠN TIKTOK
</div>

<div style="font-size:35px">
${o.id}
</div>

<div style="font-size:35px;color:lime">
GẠO ST25 5KG
</div>

</div>
`).join("")

res.send(`
<body style="background:black;color:white">

<div style="font-size:70px;color:yellow">
NAMRICE AUTO
</div>

<div style="font-size:55px;color:red">
CHƯA THANH TOÁN
</div>

<div style="font-size:40px">
MÁY MAY01
</div>

<div style="font-size:30px">
185 TỔ 8 ẤP ĐÔNG THẠNH
</div>

${html}

</body>
`)
})

app.get("/fake-tiktok",(req,res)=>{

orders.push({
id:"TT"+Date.now()
})

res.send("OK")

})

app.listen(process.env.PORT || 3000)
