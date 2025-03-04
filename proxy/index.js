const express = require("express")
const {JSDOM} = require("jsdom");
import("node-fetch")
const cors = require("cors")
const app = express()
app.use(cors())
const port = 8080

app.get("/", async (req, res) => {
    if (req.query.url && req.query.url.startsWith("https://music.apple.com")) {
        const response = await fetch(req.query.url)
        if (!response.ok) {
            res.sendStatus(404)
            return
        }
        const dom = new JSDOM(await response.text())
        res.send(JSON.parse(dom.window.document.getElementById('serialized-server-data').textContent)[0])
    } else {
        res.sendStatus(400)
    }
})

app.listen(port, () => {
    console.log("Lumine proxy running")
})