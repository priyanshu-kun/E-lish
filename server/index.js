require("dotenv").config()
const express = require("express");
const app = express()
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.json({ limit: "1mb" }))
app.use(require("cors")())
app.post("/api", (req, res) => {
    let currentDate = new Date()
    let data = req.body
    console.log('datetime: ', currentDate, " data: ", data)
    res.json({
        status: 200
    })
})

app.post("/api/message", async (req, res) => {
    try {
        const {message, no} = req.body
        console.log(req.body)
        const accountSid = process.env.ACCOUNT_SID;
        const authToken = process.env.AUTH_TOKEN;
        const client = require('twilio')(accountSid, authToken, {
            lazyLoading: true
        });
        client.messages
              .create({body: message, from: '+17278004475', to: `+91${no}`})
              .then(message => console.log(message.sid));

            res.send()
    }
    catch (e) {
        console.log(e)
    }
})



app.listen(9000, () => console.log("Listen"))