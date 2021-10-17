const mongoose =require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    brandName :{
        type : String,
        required:true,
        trim:true
    },
    brandImage :{
        type : String,
        required:true,
        trim:true
    },
    category : [
            {
        type : mongoose.Schema.Types.ObjectId,
        ref:'Category',
        trim:true
    }
    ],
    brandStatus :{
        type:String
    },
})
 

// userSchema.methods.generateAuthToken = async function () {
//         const brand = this
//         const token = jwt.sign({_id: brand._id.toString()} , 'thisismynewcourse')
//         brand.tokens = brand.tokens.concat({token})
//         await  brand.save()
// }

// userSchema.statics.findByCredentials = async (email , password) =>{
//     const user = await User.findOne({ email })
//     if (!user){
//         throw new Error ('unable to login')
//     }

//     const isMatch = await bcrypt.compare(password , user.password)
     
//     if(!isMatch){
//         throw new Error ('unable to login')
//     }
//     return user
// }

// userSchema.pre('save' , async function (next) {
//     const user = this 
    
//     if(user.isModified('password')){
//         user.password = await bcrypt.hash(user.password , 8)
//     }

//     next()
// })

const Brand = mongoose.model('Brand' , userSchema)
module.exports= Brand
