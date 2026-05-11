const express=require("express")

const app=express()

app.use(express.json())

let locked=true



app.get("/",(req,res)=>{

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



app.get("/picked",(req,res)=>{

locked=false

res.send("DA MO KHOA")

})



app.get("/lock",(req,res)=>{

locked=true

res.send("DA KHOA")

})



app.get("/tiktok",(req,res)=>{

res.send("TIKTOK WEBHOOK OK")

})



app.post("/sepay",(req,res)=>{

console.log("SEPAY OK")

console.log(req.body)

res.send("OK")

})



app.post("/tiktok",(req,res)=>{

console.log("TIKTOK OK")

console.log(req.body)



locked=false



res.send("OK")

})

app.get("/auth",(req,res)=>{

const appKey=process.env.TTS_APP_KEY

const redirectUri="https://maybangao2-production.up.railway.app/callback"

const authUrl=`https://services.tiktokshop.com/open/authorize?app_key=${appKey}&state=namrice123&redirect_uri=${encodeURIComponent(redirectUri)}`

res.redirect(authUrl)

})



app.get("/callback",(req,res)=>{

const code=req.query.code

console.log("TIKTOK CODE:",code)

res.send("KET NOI TIKTOK SHOP THANH CONG")

})

app.listen(process.env.PORT || 3000,()=>{

console.log("Server running")

})
