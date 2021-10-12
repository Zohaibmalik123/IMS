const express = require('express')
const Brand = require('../Model/brand')
const Product = require('../Model/product')
const router = new express.Router()
const auth = require('../middleware/authuser')
const Category = require("../Model/category")
const assert = require('assert')



router.post('/create/brand' ,auth , async (req , res)=>{
    const brand = await  Brand.find(req.body)
    const category = await Category.find({categoryName: req.body.categoryName})
    try{
        const brand = new Brand()
        // console.log(brand)
        brand.brandName = req.body.brandName
        brand.brandStatus = req.body.brandStatus
        brand.category = category
        await brand.save()
        res.status(201).send(brand)
        console.log("hdssfdvdgcd", brand.category)
    } catch (e) {
        res.status(400).send(e)
    }

})

router.get('/get-brands', auth  , async (req , res)=>{
    try{
        // const brand = await Brand.aggregate([
            // {
            //     $match:{}
            // },
            //     {
            //         $unwind:"$category"
            //     },
            //     {
            //         $lookup:
            //             {
            //                 from: "categories",
            //                 localField: "category",
            //                 foreignField: "_id",
            //                 as: "category"
            //             }
            //     },
            // {
            //     $project: {
            //         "category.categoryStatus": 0,
            //         "category.parentCategory": 0,
            //         "category.__v": 0,
            //         "category._id": 0,
            //
            //     },
            // },
            // {
            //     $group:{
            //         _id:"$brandName",
            //         categoryArray:{$push:"$category"}
            //     }
            // }
            // ,
            // ])

        const brand2 = await Brand.find({}).populate("category");
        const brandsFilter = brand2.flatMap(singleBrand => {
              const data = singleBrand.category.map(({categoryName})=>({categoryName}));
              return {
                  brandName: singleBrand.brandName,
                  brandStatus: singleBrand.brandStatus,
                  category:data
              }
        })
        console.log({brandsFilter})
        res.send(brandsFilter)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/get-brand/:id' , auth , async (req , res)=>{
    const id = req.params.id

    try{
        const brands = await Brand.findById(id).populate('category')
        res.send(brands)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/brand/update/:id' , auth ,async (req , res)=>{
    try{
         const _id = req.params.id;
        const updateBrand = await Brand.findByIdAndUpdate( _id , req.body)
        res.send(updateBrand)
    } catch(e){
        res.status(400).send(e)
    }
})

router.delete('/delete/brand/:id' ,auth , async (req , res)=> {
    const id = req.params.id

    try {

        const products = await Product.find({brandId:id})
        // console.log(products)
        if(products.length){
            res.status(404).send("ds")
        }else {
            const deleteBrand = await Brand.findOneAndDelete({_id: id})
            if (!deleteBrand) {
                res.status(404).send()
            }
            res.send(deleteBrand)
        }
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports= router