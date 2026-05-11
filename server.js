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

app.get("/", (req, res) => {

  res.send(`
  <body style="background:black;color:white;font-family:Arial;padding:30px;">

  <h1>NAMRICE AUTO</h1>

  <form action="/upload" method="POST" enctype="multipart/form-data">

  <input type="file" name="video">

  <button type="submit">
  UPLOAD VIDEO
  </button>

  </form>

  <br>

  <a href="/videos" style="color:lime;font-size:25px;">
  MO VIDEO
  </a>

  </body>
  `)

})

app.post("/upload", upload.single("video"), (req, res) => {

  res.redirect("/videos")

})

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
    background:black;
    ">

    <video
    width="330"
    height="580"
    controls
    autoplay
    style="
    border-radius:20px;
    object-fit:cover;
    background:black;
    "
    >

    <source src="/uploads/${file}" type="video/mp4">

    </video>

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

app.listen(3000, () => app.listen(process.env.PORT || 3000, () => {

console.log("Server running")

})

  
