import dbconnection from "./db/dbconnection.js";
import app from "./app.js";
import dotenv from 'dotenv'

dotenv.config({
    path: '.env'
})


const port = process.env.PORT || 5000


dbconnection()
try {
    app.listen(port, () => {
        console.log(`server is running on ${port}`)
    })
} catch (error) {
    console.log(error)
}






