import * as dotenv from 'dotenv'
dotenv.config()
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import bodyParser from "body-parser"
import productRouter from "./routes/productRouter.js"
import categoryRouter from "./routes/categoryRouter.js"
import adRouter from "./routes/adsRouter.js"
import userRouter from "./routes/userRouter.js"
import orderRouter from './routes/orderRouter.js'

const app = express()

app.use(express.json())

app.use(cors({origin:["http://localhost:3000","http://localhost:3001"]}))

main().then(console.log("database runnig...")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sdp2_ecomm');
}


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.static("public"))

app.use("/api/product",productRouter);
app.use("/api/order",orderRouter)
app.use("/api/category",categoryRouter);
app.use("/api/ads",adRouter)
app.use("/api/user",userRouter)



export default app;