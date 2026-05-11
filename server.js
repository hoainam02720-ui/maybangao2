const express=require("express")
const https=require("https")

const app=express()

app.use(express.json())

let locked=true


// =========================
// TRANG CHÍNH
// =========================

app.get("/",(req,res)=>{

res.send(`

<body style="background:black;color:white">

<div style="font-size:70px;color:yellow">
NAMRICE AUTO
</div>

<div style="font-size:55px;color:lime">
${locked ? "DANG KHÓA" : "ĐÃ MỞ KHÓA"}
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


// =========================
// MỞ KHÓA
// =========================

app.get("/picked",(req,res)=>{

locked=false

res.send("DA MO KHOA")

})


// =========================
// KHÓA LẠI
// =========================

app.get("/lock",(req,res)=>{

locked=true

res.send("DA KHOA")

})


// =========================
// TEST WEBHOOK
// =========================

app.get("/tiktok",(req,res)=>{

res.send("TIKTOK WEBHOOK OK")

})


// =========================
// SEPAY WEBHOOK
// =========================

app.post("/sepay",(req,res)=>{

console.log("SEPAY OK")
console.log(req.body)

locked=false

res.send("OK")

})


// =========================
// TIKTOK WEBHOOK
// =========================

app.post("/tiktok",(req,res)=>{

console.log("TIKTOK ORDER")
console.log(req.body)

locked=false

res.send("OK")

})


// =========================
// AUTH TIKTOK
// =========================

app.get("/auth",(req,res)=>{

const appKey=process.env.TTS_APP_KEY

const redirect=`https://auth.tiktok-shops.com/api/v2/authorize?app_key=${appKey}&state=namrice`

res.redirect(redirect)

})


// =========================
// CALLBACK TIKTOK
// =========================

app.get("/callback", async (req,res)=>{

const code=req.query.auth_code || req.query.code

console.log("TIKTOK CODE:",code)

if(!code){

return res.send("KHONG CO CODE")

}

const data=JSON.stringify({
app_key:process.env.TTS_APP_KEY,
app_secret:process.env.TTS_APP_SECRET,
auth_code:code,
grant_type:"authorized_code"
})

const options={
hostname:"auth.tiktok-shops.com",
path:"/api/v2/token/get",
method:"POST",
headers:{
"Content-Type":"application/json",
"Content-Length":data.length
}
}

const tikTokReq=https.request(options,(tikTokRes)=>{

let body=""

tikTokRes.on("data",(chunk)=>{
body+=chunk
})

tikTokRes.on("end",()=>{

console.log("TOKEN:")
console.log(body)

res.send(body)

})

})

tikTokReq.on("error",(e)=>{

console.log(e)

res.send("LOI TOKEN")

})


tikTokReq.write(data)

tikTokReq.end()

})


// =========================
// SERVER
// =========================

app.listen(process.env.PORT || 3000,()=>{

console.log("Server running")

})
