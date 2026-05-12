const express = require("express")
const multer = require("multer")
const fs = require("fs")
const path = require("path")

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())



// =======================
// TAO THU MUC UPLOAD
// =======================

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads")
}

app.use("/uploads", express.static("uploads"))



// =======================
// DATA TAM
// =======================

let videos = []

let locked = true



// =======================
// MULTER
// =======================

const storage = multer.diskStorage({

destination: function(req, file, cb) {

cb(null, "uploads")

},

filename: function(req, file, cb) {

cb(null, Date.now() + "-" + file.originalname)

}

})

const upload = multer({ storage: storage })



// =======================
// HOME
// =======================

app.get("/", (req, res) => {

res.send(`

<body style="
background:black;
color:white;
font-family:Arial;
padding:20px;
">

<h1 style="color:yellow;">
NAMRICE AUTO
</h1>

<div style="
color:lime;
font-size:25px;
">
${locked ? "DANG KHOA" : "DA MO KHOA"}
</div>

<hr>

<h2>UPLOAD VIDEO</h2>

<form action="/upload" method="POST" enctype="multipart/form-data">

<input type="text"
name="title"
placeholder="Nhap tieu de video"
required
style="
padding:12px;
font-size:20px;
width:300px;
">

<br><br>

<input type="file"
name="video"
required>

<br><br>

<button type="submit"
style="
padding:15px;
font-size:20px;
">
UPLOAD VIDEO
</button>

</form>

<br><br>

<a href="/videos"
style="
color:aqua;
font-size:30px;
">
XEM VIDEO
</a>

</body>

`)

})



// =======================
// UPLOAD VIDEO
// =======================

app.post("/upload", upload.single("video"), (req, res) => {

const title = req.body.title

const filename = req.file.filename

videos.push({

title,
filename,
views: 0,
likes: Math.floor(Math.random()*500),
comments: [
"gao dep qua",
"lua nay ngon",
"muon mua"
]

})

res.redirect("/videos")

})



// =======================
// FEED VIDEO
// =======================

app.get("/videos", (req, res) => {

let html = ""

videos.reverse().forEach(video => {

video.views += 1

html += `

<div style="
height:100vh;
display:flex;
justify-content:center;
align-items:center;
flex-direction:column;
background:black;
border-bottom:2px solid #222;
position:relative;
">

<video
width="330"
height="580"
controls
autoplay
style="
border-radius:20px;
background:black;
object-fit:cover;
">

<source src="/uploads/${video.filename}" type="video/mp4">

</video>



<div style="
position:absolute;
bottom:170px;
left:20px;
color:white;
">

<div style="
font-size:28px;
font-weight:bold;
">
@namrice_auto
</div>

<div style="
font-size:24px;
margin-top:10px;
">
${video.title}
</div>

<div style="
font-size:18px;
margin-top:10px;
color:lime;
">
🌾 GAO ST25 • 25K/KG
</div>

</div>



<div style="
position:absolute;
right:20px;
bottom:180px;
display:flex;
flex-direction:column;
gap:25px;
align-items:center;
color:white;
">

<div style="font-size:30px">
❤️
<br>
${video.likes}
</div>

<div style="font-size:30px">
💬
<br>
${video.comments.length}
</div>

<div style="font-size:30px">
👁️
<br>
${video.views}
</div>

</div>



<div style="
position:absolute;
bottom:60px;
left:20px;
right:20px;
display:flex;
justify-content:space-between;
">

<a href="/delete/${video.filename}"
style="
background:red;
color:white;
padding:12px 20px;
border-radius:12px;
font-size:20px;
text-decoration:none;
">
XOA VIDEO
</a>

<div style="
background:#00aa44;
padding:12px 20px;
border-radius:12px;
font-size:20px;
">
MUA GAO
</div>

</div>



<div style="
position:absolute;
bottom:10px;
left:20px;
color:gray;
font-size:18px;
">

💬 ${video.comments.join(" • ")}

</div>

</div>

`

})

res.send(`

<body style="
margin:0;
background:black;
font-family:Arial;
overflow-y:scroll;
scroll-snap-type:y mandatory;
">

${html}

</body>

`)

})



// =======================
// XOA VIDEO
// =======================

app.get("/delete/:name", (req, res) => {

const name = req.params.name

try {

fs.unlinkSync("uploads/" + name)

videos = videos.filter(v => v.filename !== name)

} catch(err) {

console.log(err)

}

res.redirect("/videos")

})



// =======================
// SEPAY WEBHOOK
// =======================

app.post("/sepay", (req, res) => {

console.log("SEPAY:")

console.log(req.body)

locked = false

res.send("OK")

})



// =======================
// KHOA / MO KHOA
// =======================

app.get("/picked", (req, res) => {

locked = false

res.send("DA MO KHOA")

})

app.get("/lock", (req, res) => {

locked = true

res.send("DA KHOA")

})



// =======================
// TIKTOK CALLBACK
// =======================

app.get("/callback", (req, res) => {

res.send("TIKTOK CALLBACK OK")

})



// =======================
// AI DE XUAT VIDEO
// =======================

app.get("/foryou", (req, res) => {

const randomVideos = [...videos]
.sort(() => Math.random() - 0.5)

res.json(randomVideos)

})



// =======================
// SERVER
// =======================
app.get('/auth', (req, res) => {
  const appKey = '6jt5ub588f51q';

  const redirectUri =
    'https://maybangao2-production.up.railway.app/callback';

  const authUrl =
    `https://services.tiktokshop.com/open/authorize?service_id=${appKey}&state=namrice&redirect_uri=${encodeURIComponent(redirectUri)}`

  res.redirect(authUrl);
});

app.get('/callback', (req, res) => {
  const code = req.query.code;

  res.send('TikTok authorization success: ' + code);
});
app.listen(process.env.PORT || 3000, () => {

console.log("Server running")

})
