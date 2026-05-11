// ======================
// XOA VIDEO
// ======================

app.get("/delete/:name",(req,res)=>{

const file=req.params.name

try{

fs.unlinkSync("uploads/"+file)

console.log("DA XOA:",file)

}catch(err){

console.log(err)

}

res.redirect("/videos")

})



// ======================
// VIDEO FEED KIEU TIKTOK
// ======================

app.get("/videos",(req,res)=>{

const files=fs.readdirSync("uploads")

let html=""

files.reverse().forEach(file=>{

const randomViews=Math.floor(Math.random()*90000)+1000
const randomLikes=Math.floor(Math.random()*5000)+100
const randomComments=Math.floor(Math.random()*300)+10

html+=`

<div style="
height:100vh;
display:flex;
justify-content:center;
align-items:center;
flex-direction:column;
position:relative;
background:black;
border-bottom:2px solid #222;
scroll-snap-align:start;
">

<video
width="330"
height="580"
controls
autoplay
style="
border-radius:25px;
background:black;
object-fit:cover;
">

<source src="/uploads/${file}" type="video/mp4">

</video>



<div style="
position:absolute;
bottom:170px;
left:20px;
color:white;
">

<div style="
font-size:30px;
font-weight:bold;
">
@namrice_auto
</div>

<div style="
font-size:22px;
margin-top:10px;
">
🌾 Video nong nghiep - ban gao ST25
</div>

<div style="
font-size:20px;
margin-top:10px;
color:lime;
">
GAO ST25 • 25K/KG
</div>

</div>



<div style="
position:absolute;
right:18px;
bottom:180px;
display:flex;
flex-direction:column;
align-items:center;
gap:28px;
color:white;
">

<div style="text-align:center">

<div style="font-size:38px">
❤️
</div>

<div style="font-size:18px">
${randomLikes}
</div>

</div>



<div style="text-align:center">

<div style="font-size:38px">
💬
</div>

<div style="font-size:18px">
${randomComments}
</div>

</div>



<div style="text-align:center">

<div style="font-size:38px">
👁️
</div>

<div style="font-size:18px">
${randomViews}
</div>

</div>

</div>



<div style="
position:absolute;
bottom:70px;
left:20px;
right:20px;
display:flex;
justify-content:space-between;
align-items:center;
">

<a href="/delete/${file}"
style="
background:red;
color:white;
padding:12px 22px;
border-radius:15px;
font-size:22px;
text-decoration:none;
font-weight:bold;
">
XOA VIDEO
</a>

<div style="
background:#00aa44;
padding:12px 20px;
border-radius:15px;
font-size:22px;
font-weight:bold;
">
MUA GAO
</div>

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

<div style="
position:fixed;
top:0;
left:0;
right:0;
z-index:999;
padding:18px;
background:rgba(0,0,0,0.7);
backdrop-filter:blur(10px);
">

<div style="
font-size:40px;
font-weight:bold;
color:yellow;
">
NAMRICE AUTO
</div>

<div style="
font-size:18px;
color:white;
margin-top:5px;
">
VIDEO • BAN GAO • MAY BAN GAO TU DONG
</div>

</div>

<div style="height:90px"></div>

${html}

</body>

`)

})
