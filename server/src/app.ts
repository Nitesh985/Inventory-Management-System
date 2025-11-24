import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { auth } from "./lib/auth.ts";
import { toNodeHandler } from "better-auth/node";



const app = express()

app.all('/api/auth/*splat', toNodeHandler(auth));
app.use(cors({
    origin:"http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static('public'))

app.use(cookieParser())


// routes
import customerRouter from './routes/customer.routes.ts'
import expenseRouter from './routes/expense.routes.ts'
import inventoryRouter from './routes/inventory.routes.ts'
import productRouter from './routes/product.routes.ts'
import salesRouter from './routes/sales.routes.ts'
import shopRouter from './routes/shop.routes.ts'

app.use("/customers", customerRouter)
app.use("/expenses", expenseRouter)
app.use("/inventory", inventoryRouter)
app.use("/products", productRouter)
app.use("/sales", salesRouter)
app.use("/shops", shopRouter)


app.post("/api/v1/test", (req, res)=>{
    console.log(req.body)
    return res.status(201).json({data:"hi"})
})

app.use("/api/v1/test", (req,res)=>{
    return res.status(200).json({
        message:"Everything is okay",
        status:200
    })
})



export default app
