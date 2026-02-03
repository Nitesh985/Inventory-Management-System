import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { auth } from "./lib/auth.ts";
import { toNodeHandler } from "better-auth/node";
import chatbotRoutes from "./routes/chatbot.routes.ts";



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
import userRouter from './routes/user.routes.ts'
import expenseRouter from './routes/expense.routes.ts'
import inventoryRouter from './routes/inventory.routes.ts'
import productRouter from './routes/product.routes.ts'
import salesRouter from './routes/sales.routes.ts'
import shopRouter from './routes/shop.routes.ts'
import dashboardRouter from './routes/dashboard.routes.ts'
import dataManagementRouter from './routes/data-management.routes.ts'
import budgetRouter from './routes/budget.routes.ts'
import creditRouter from './routes/credit.routes.ts'
import categoryRouter from './routes/category.routes.ts'
import chatRouter from './routes/chat.routes.ts'


app.use("/api/customers", customerRouter)
app.use("/api/users", userRouter)
app.use("/api/expenses", expenseRouter)
app.use("/api/inventory", inventoryRouter)
app.use("/api/products", productRouter)
app.use("/api/categories", categoryRouter)
app.use("/api/sales", salesRouter)
app.use("/api/shops", shopRouter)
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/data-management", dataManagementRouter);
app.use("/api/budgets", budgetRouter);
app.use("/api/credits", creditRouter);
app.use("/api/chats", chatRouter);



app.post("/api/v1/test", (req, res)=>{
    return res.status(201).json({data:"hi"})
})



export default app
