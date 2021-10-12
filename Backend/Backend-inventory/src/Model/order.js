const mongoose =require('mongoose')
const validator = require('validator')
const {stringify} = require("nodemon/lib/utils");

const userSchema = mongoose.Schema({

    customerName :{
        type : String,
        required:true,
        trim:true
    },
    customerPhoneNo :{
        type : Number,
        trim:true
    },
    orderDate :{
        type:String,
        required:true,
        default: (new Date()).getTime()
    },
    productName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true,
        trim: true
    },
    rate:{
        type:Number,
        trim:true
    },
    quantity:{
        type:Number,
        trim:true
    },
    Total:{
        type:Number,
        trim:true
    },
    totalAmount:{
        type:Number,
        trim:true
    },
    discount:{
        type:String,
        trim:true,
    },
    paymont:{
        type:String,
        required:true
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

const Order = mongoose.model('Order' , userSchema)
module.exports= Order
