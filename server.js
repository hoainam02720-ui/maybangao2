const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

//================= BIEN MO KHOA =================
let trangThaiMo = false;

//================= TEST =================
app.get("/", (req, res) => {

    res.send("NamRice Auto OK");
});

//================= ESP32 CHECK =================
app.get("/check", (req, res) => {

    if (trangThaiMo) {

        console.log("ESP32 DA NHAN LENH");

        trangThaiMo = false;

        return res.send("OPEN");
    }

    res.send("WAIT");
});

//================= SEPAY WEBHOOK =================
app.post("/sepay", (req, res) => {

    console.log("Nhan webhook:", req.body);

    const amount = Number(req.body.transferAmount || 0);

    const content = (req.body.content || "").toLowerCase();

    //================= DIEU KIEN =================
    if (
        amount >= 2000 &&
        content.includes("may gao st25 01")
    ) {

        console.log("THANH TOAN HOP LE");

        trangThaiMo = true;
    }

    res.send("OK");
});

//================= START =================
app.listen(PORT, () => {

    console.log("Server dang chay cong", PORT);
});
