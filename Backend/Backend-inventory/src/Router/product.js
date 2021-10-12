const express = require('express')
const Product = require('../Model/product')
const Order = require('../Model/order')
const router = new express.Router()
const auth = require('../middleware/authuser')
const Category = require("../Model/category");
const Brand = require("../Model/brand");



router.post('/create/product' , auth , async (req , res)=>{
    // const product = new Product(req.body)
    // console.log(req.body)
    try{

        const brand = await Brand.findById(req.body.brandId)
        const category = await Category.findById(req.body.categoryId)
        product = new Product()
        product.brand = brand
        product.category = category
        product.productName = req.body.productName
        product.quantity = req.body.quantity
        product.rate = req.body.rate
        product.productStatus = req.body.productStatus

        await product.save()
        res.status(201).send(product)

    } catch (e) {
        res.status(400).send(e)
    }

})
router.get('/get-products' ,auth  , async (req , res)=>{
    try{
        const product = await Product.find({}).populate('category').populate('brand')
        console.log(product)
        res.send(product)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/get-products/:id' , auth , async (req , res)=>{
    const id = req.params.id
    try{
        const order = await Order.find({productId : id});
        // console.log(order)
        if(order.lenght){
            res.status(403).send()
        }else{
        const product = await Product.findById(id).populate('category').populate('brand')
        // console.log(product)
        res.send(product)
        }
    } catch (e) {
        res.status(500).send(e)
    }
})


router.patch('/product/update/:id' , auth  ,async (req , res)=>{
    try{
        const _id = req.params.id;
        // console.log(req.body);
        // console.log(_id)
        const updateProduct = await Product.findByIdAndUpdate( _id , req.body)
        res.send(updateProduct)
    } catch(e){
        res.status(400).send(e)
    }
})
router.delete('/delete/product/:id' , auth  , async (req , res)=> {
    const id = req.params.id

    try{
        const order = await Order.find({productId:id})
        if(order.length){
            res.status(404).send("ds")
        }else{
        const product = await Product.findOneAndDelete({_id:id})
        if (!product) {
            res.status(404).send()
        }
        res.send(order)
        }
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports= router