import axios from "axios"

export default async function SendMessage(message, number) {
    try {
        console.log(message, number)
        const res = await axios({
            url: "/api/message",
            method: "post",
            baseURL: "http://localhost:9000",
            data: {
                message,
                no: number
            }

        })
        console.log(res.data)
    }
    catch (e) {
        console.log(e)
    }
}


