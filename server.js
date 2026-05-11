const express=require("express")
const app=express()

let orders=[]

app.get("/",(req,res)=>{

let html=orders.map(o=>`
<div style="border:3px solid yellow;padding:20px;margin:20px;border-radius:20px">
<div style="font-size:50px;color:cyan">ĐƠN TIKTOK</div>
<div style="font-size:35px;color:white">Mã: ${o.id}</div>
<div style="font-size:35px;color:lime">Gạo ST25 5KG</div>
</div>
`).join("")

res.send(`
<body style="background:black;color:white;text-align:center;font-family:Arial">

<div style="font-size:70px;color:yellow;font-weight:bold">
NAMRICE AUTO
</div>

<div style="font-size:55px;color:red;margin-top:20px">
CHƯA THANH TOÁN
</div>

<div style="font-size:40px;margin-top:30px">
MÁY MAY01
</div>

<div style="font-size:30px;margin-top:20px">
185 tổ 8 ấp Đông Thạnh
</div>

${html}

</body>
`)
})

app.get("/fake-tiktok",(req,res)=>{

orders.push({
id:"TT"+Date.now()
})

res.send(`
<body style="background:black;color:lime;
font-size:60px;text-align:center;padding-top:200px">
ĐÃ TẠO ĐƠN TIKTOK
</body>
`)
})

app.listen(3000)
