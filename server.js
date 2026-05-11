const express=require("express")
const multer=require("multer")
const fs=require("fs")
const path=require("path")
const https=require("https")

const app=express()

app.use(express.json())



// ======================
// TAO FOLDER UPLOAD
// ======================

if(!fs.existsSync("uploads")){

fs.mkdirSync("uploads")

}

app.use("/uploads",express.static("uploads"))



// ======================
// MULTER VIDEO
// ======================

const storage=multer.diskStorage({

destination:(req,file,cb)=>{

cb(null,"uploads/")

},

filename:(req,file,cb)=>{

cb(null,Date.now()+"-"+file.originalname)

}

})

const upload=multer({storage})



// ======================
// TRANG THAI MAY
// ======================

let locked=true



// ======================
// HOME
// ======================

app.get("/",(req,res)=>{

res.send(`

<body style="background:black;color:white;font-family:sans-serif">

<h1 style="color:yellow">
NAMRICE AUTO
</h1>

<h2 style="color:lime">
${locked ? "DANG KHOA" : "DA MO KHOA"}
</h2>

<hr>

<h2>UPLOAD VIDEO</h2>

<form action="/upload" method="post" enctype="multipart/form-data">

<input type="file" name="video">

<br><br>

<button type="submit">
UPLOAD VIDEO
</button>

</form>

<br>

<a href="/videos" style="color:cyan;font-size:25px">
XEM VIDEO
</a>

</body>

`)

})



// ======================
// UPLOAD VIDEO
// ======================

app.post("/upload",upload.single("video"),(req,res)=>{

if(!req.file){

return res.send("KHONG CO VIDEO")

}

res.redirect("/videos")

})



// ======================
// XEM VIDEO
// ======================

app.get("/videos",(req,res)=>{

const files=fs.readdirSync("uploads")

let html=`

<body style="background:black;color:white;font-family:sans-serif">

<h1 style="color:yellow">
VIDEO NAMRICE
</h1>

<a href="/" style="color:cyan">
UPLOAD THEM
</a>

<hr>

`

files.reverse().forEach(file=>{

html+=`

<div style="margin-bottom:50px">

<video width="320" controls>

<source src="/uploads/${file}">

</video>

</div>

`

})

html+=`</body>`

res.send(html)

})



// ======================
// MO KHOA
// ======================

app.get("/picked",(req,res)=>{

locked=false

res.send("DA MO KHOA")

})



// ======================
// KHOA LAI
// ======================

app.get("/lock",(req,res)=>{

locked=true

res.send("DA KHOA")

})



// ======================
// SEPAY WEBHOOK
// ======================

app.post("/sepay",(req,res)=>{

console.log("SEPAY OK")

console.log(req.body)

locked=false

res.send("OK")

})



// ======================
// TIKTOK WEBHOOK
// ======================

app.post("/tiktok",(req,res)=>{

console.log("TIKTOK WEBHOOK")

console.log(req.body)

res.send("OK")

})



// ======================
// AUTH TIKTOK
// ======================

app.get("/auth",(req,res)=>{

const appKey=process.env.TTS_APP_KEY

const redirect=`https://auth.tiktok-shops.com/api/v2/authorize?app_key=${appKey}&state=namrice&redirect_uri=https://maybangao2-production.up.railway.app/callback`

res.redirect(redirect)

})



// ======================
// CALLBACK TIKTOK
// ======================

app.get("/callback",async(req,res)=>{

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



// ======================
// SERVER
// ======================

app.listen(process.env.PORT || 3000,()=>{

console.log("Server running")

})
