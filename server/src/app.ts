import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { auth } from "./lib/auth.ts";
import { toNodeHandler } from "better-auth/node";



const app = express()

app.use(cors({
    origin:"http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
app.all('/api/auth/*splat', toNodeHandler(auth));


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

app.use("/api/customers", customerRouter)
app.use("/api/expenses", expenseRouter)
app.use("/api/inventory", inventoryRouter)
app.use("/api/products", productRouter)
app.use("/api/sales", salesRouter)
app.use("/api/shops", shopRouter)


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
