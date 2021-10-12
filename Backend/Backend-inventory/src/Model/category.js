const mongoose =require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({

    categoryName :{
        type : String,
        required:true,
        trim:true
    },
    parentCategory :{
        type : mongoose.Schema.Types.ObjectId,
        ref:'Category',
        trim:true
    },
    categoryStatus :{
        type:String
    },
})

const Category = mongoose.model('Category' , userSchema)
module.exports= Category
