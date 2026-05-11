Hoàng ơi sửa giúp tao nguyên file "server.js" nha 😄
Code cũ bị lỗi dấu ` nên Railway chạy không được.

Thay nguyên file bằng code này luôn:

const express = require("express")
const multer = require("multer")
const fs = require("fs")

const app = express()

app.use("/uploads", express.static("uploads"))

if (!fs.existsSync("uploads")) {
fs.mkdirSync("uploads")
}

const storage = multer.diskStorage({

destination: function(req, file, cb) {
cb(null, "uploads")
},

filename: function(req, file, cb) {
cb(null, Date.now() + "-" + file.originalname)
}

})

const upload = multer({ storage: storage })



// =========================
// TRANG CHINH
// =========================

app.get("/", (req, res) => {

res.send(`
<body style="
background:black;
color:white;
font-family:Arial;
padding:30px;
">

<h1>NAMRICE AUTO</h1>

<form action="/upload" method="POST" enctype="multipart/form-data">

<input type="file" name="video">

<button type="submit">
UPLOAD VIDEO
</button>

</form>

<br>

<a href="/videos" style="
color:lime;
font-size:25px;
">
MO VIDEO
</a>

</body>
`)
})



// =========================
// UPLOAD VIDEO
// =========================

app.post("/upload", upload.single("video"), (req, res) => {

res.redirect("/videos")

})



// =========================
// XOA VIDEO
// =========================

app.get("/delete/:name", (req, res) => {

const file = req.params.name

try {

fs.unlinkSync("uploads/" + file)

console.log("DA XOA:", file)

} catch(err) {

console.log(err)

}

res.redirect("/videos")

})



// =========================
// VIDEO FEED
// =========================

app.get("/videos", (req, res) => {

const files = fs.readdirSync("uploads")

let html = ""

files.reverse().forEach(file => {

html += `
<div style="
height:100vh;
display:flex;
justify-content:center;
align-items:center;
flex-direction:column;
background:black;
border-bottom:2px solid #222;
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
"
>

<source src="/uploads/${file}" type="video/mp4">

</video>

<br>

<a href="/delete/${file}" style="
background:red;
color:white;
padding:12px 20px;
border-radius:12px;
text-decoration:none;
font-size:22px;
">
XOA VIDEO
</a>

</div>
`

})

res.send(`
<body style="
margin:0;
background:black;
">

${html}

</body>
`)
})



app.listen(3000, () => {

console.log("Server running")

})

Rồi commit lại để Railway tự deploy 😄
