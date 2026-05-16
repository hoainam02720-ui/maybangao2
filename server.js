const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

//========================
let trangThaiMo = false;
//========================

// TEST WEB
app.get("/", (req, res) => {

    res.send("NamRice Auto OK");
});

//========================
// ESP32 CHECK
//========================
app.get("/check", (req, res) => {

    if (trangThaiMo) {

        console.log("GUI LENH OPEN");

        trangThaiMo = false;

        return res.send("OPEN");
    }

    res.send("OPEN");
});

//========================
// SEPAY WEBHOOK
//========================
app.post("/sepay", (req, res) => {

    console.log(req.body);

    const amount = Number(req.body.transferAmount || 0);

    const content = (req.body.content || "").toLowerCase();

    if (
        amount >= 2000 &&
        content.includes("may gao st25 01")
    ) {

        console.log("THANH TOAN HOP LE");

        trangThaiMo = true;
    }

    res.send("OK");
});

//========================
app.listen(PORT, () => {

    console.log("Server running:", PORT);
});
