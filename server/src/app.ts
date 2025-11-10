import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'



const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static('public'))

app.use(cookieParser())


// routes

import userRouter from './routes/user.routes.js'



app.use("/api/v1/users", userRouter)
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