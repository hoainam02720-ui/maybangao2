const express=require("express")
const https=require("https")
const multer=require("multer")
const path=require("path")

const app=express()

app.use(express.json())



// =========================
// VIDEO STORAGE
// =========================

const storage=multer.diskStorage({

destination:(req,file,cb)=>{

cb(null,"uploads/")

},

filename:(req,file,cb)=>{

cb(null,Date.now()+path.extname(file.originalname))

}

})

const upload=multer({storage})

app.use("/uploads",express.static("uploads"))



// =========================
// TRANG THÁI KHÓA
// =========================

let locked=true



// =========================
// DANH SÁCH VIDEO
// =========================

let videos=[]



// =========================
// TRANG CHÍNH
// =========================

app.get("/",(req,res)=>{

let videoHtml=""

videos.reverse().forEach(v=>{

videoHtml+=`

<div style="margin-top:40px">

<h2>${v.title}</h2>

<video width="320" controls>
<source src="${v.url}">
</video>

</div>

`

})

res.send(`

<body style="background:black;color:white">

<h1 style="color:yellow">
NAMRICE AUTO
</h1>

<h2 style="color:lime">
${locked ? "DANG KHOA" : "DA MO KHOA"}
</h2>

<hr>

<h2>UPLOAD VIDEO</h2>

<form action="/upload" method="post" enctype="multipart/form-data">

<input type="text" name="title" placeholder="Ten video">

<br><br>

<input type="file" name="video">

<br><br>

<button type="submit">
UPLOAD
</button>

</form>

<hr>

${videoHtml}

</body>

`)

})



// =========================
// UPLOAD VIDEO
// =========================

app.post("/upload",upload.single("video"),(req,res)=>{

const title=req.body.title

const file=req.file

if(!file){

return res.send("KHONG CO VIDEO")

}

const url="/uploads/"+file.filename

videos.push({

title,
url

})

res.redirect("/")

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

console.log("TIKTOK WEBHOOK")

console.log(req.body)

res.send("OK")

})



// =========================
// AUTH TIKTOK
// =========================

app.get("/auth",(req,res)=>{

const appKey=process.env.TTS_APP_KEY

const redirect=`https://auth.tiktok-shops.com/api/v2/authorize?app_key=${appKey}&state=namrice&redirect_uri=https://maybangao2-production.up.railway.app/callback`

res.redirect(redirect)

})



// =========================
// CALLBACK TIKTOK
// =========================

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



// =========================
// SERVER
// =========================

app.listen(process.env.PORT || 3000,()=>{

console.log("Server running")

})
