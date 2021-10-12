const mongoose =require('mongoose')
mongoose.connect('mongodb://localhost:27017/inventory-system-api' , {
    useNewUrlParser:true,
})