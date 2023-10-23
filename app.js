import * as dotenv from 'dotenv'
dotenv.config()
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import productRouter from "./routes/productRouter.js"
import categoryRouter from "./routes/categoryRouter.js"
import adRouter from "./routes/adsRouter.js"
import userRouter from "./routes/userRouter.js"
import orderRouter from './routes/orderRouter.js'
import cartRouter from './routes/cartRouter.js'

const app = express()

app.use(express.json())

app.use(cors({origin:["http://localhost:3000","http://localhost:3001","https://lembda.vercel.app","https://admin-lembda.netlify.app","https://admin-lembda.vercel.app","http://localhost:5173"]}))

main().then(console.log("database runnig...")).catch(err => console.log(err));

async function main() {
  const prod = false
  if(prod){
    await mongoose.connect(process.env.MONGODB_PROD_URL);
  }else{
    await mongoose.connect(process.env.MONGODB_DEV_URL);
  }
}


app.get('/', (req, res) => {
  const ip = req.socket.localAddress
  res.send(`your ip: ${ip}`)
})

app.use(express.static("public"))

app.use("/api/product",productRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter)
app.use("/api/category",categoryRouter);
app.use("/api/ads",adRouter)
app.use("/api/user",userRouter)



export default app;