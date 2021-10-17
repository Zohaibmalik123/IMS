
var path = require('path')
const express = require('express')
const cors = require('cors')
require('./db/mongoose')
const userRouter = require('./Router/user')
const brandRouter = require('./Router/brand')
const categoryRouter = require('./Router/category')
const productRouter = require('./Router/product')
const orderRouter = require('./Router/order')

const app = express()

 
const port = process.env.PORT || 8000

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))
app.use(express.json())
app.use(cors({
    origin:'*'
}))
app.use(userRouter)
app.use(brandRouter)
app.use(categoryRouter)
app.use(productRouter)
app.use(orderRouter)

app.listen(port , ()=>{
    console.log('server is up on port' + port)
})