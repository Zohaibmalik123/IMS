const mongoose =require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({

    productName :{
        type : String,
        required:true,
        trim:true
    },
    quantity :{
        type:String,
        required:true
    },
    rate:{
        type:Number,
        required:true,
        trim: true
    },
    category :{
        type : mongoose.Schema.Types.ObjectId,
        ref:'Category',
        // required:true,
        trim:true
    },
    brand:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Brand',
        // required: true
    },
    productStatus:{
        type:String
    }
})


// userSchema.methods.generateAuthToken = async function () {
//         const category = this
//         const token = jwt.sign({Id : category.Id.toString()} , 'thisismynewcourse')
//         category.tokens = category.tokens.concat({token})
//         await  category.save()
//         return token
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

const Product = mongoose.model('Product' , userSchema)
module.exports= Product
