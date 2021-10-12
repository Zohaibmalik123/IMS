const express = require('express')
const Order = require('../Model/order')
const router = new express.Router()
const auth = require('../middleware/authuser')



router.post('/create/order' , auth , async (req , res)=>{
    const order = new Order(req.body)
    try{
        await order.save()
        res.status(201).send(order)

    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }

})

router.get('/get-orders',auth  , async (req , res)=>{
    try{
        const order = await Order.find({})
        res.send(order)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/get-products/:id',auth  , async (req , res)=>{
    const id = req.params.id
    try{
        const order = await Product.findById(id).populate('product')
        res.send(order)
    } catch (e) {
        res.status(500).send(e)
    }
})
// router.patch('/order/update/:id' ,auth  ,async (req , res)=>{
//     try{
//         const _id = req.params.id;
//         // console.log(req.body);
//         // console.log(_id)
//         const updateOrder = await Order.findByIdAndUpdate( _id , req.body)
//         res.send(updateOrder)
//     } catch(e){
//         res.status(400).send(e)
//     }
// })

//
// router.delete('/delete/product' , async (req , res)=>{
//     try{
//         await req.brand.remove()
//         // console.log(req.brand)
//         res.send(req.brand)
//     } catch(e){
//         res.status(500).send(e)
//     }
// })

module.exports= router