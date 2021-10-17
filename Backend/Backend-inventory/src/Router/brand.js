const express = require('express')
const Brand = require('../Model/brand')
const Product = require('../Model/product')
const router = new express.Router()
const auth = require('../middleware/authuser')
const Category = require("../Model/category")
const assert = require('assert')
var base64ToImage = require('base64-to-image');
var multer = require('multer');
var path = require('path')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, 'images/')
    },
    filename: function (req, file, cb) {
        let ext = ''; // set default extension (if any)
        if (file.originalname.split(".").length>1) // checking if there is an extension or not.
            ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, Date.now() + ext)
    }
})
var upload = multer({ storage: storage });

router.post('/upload/image',upload.single('upload'), (req, res)=>{
    res.status(200).send();
    // console.log(res.send())
})

router.post('/create/brand' ,auth , async (req , res)=>{
    brandImage = (base64ToImage(req.body.brandImage, 'public/images/'));
    const brand = await  Brand.findOne(req.body)
    const category = await Category.findById(req.body.categoryId);
    try{

        const brand = new Brand()
        brand.brandName = req.body.brandName
        brand.brandImage = brandImage.fileName
        brand.brandStatus = req.body.brandStatus
        brand.category = category
        await brand.save()
        res.status(201).send(brand)
    } catch (e) {
        res.status(400).send(e)
    }

})

router.get('/get-brands', auth  , async (req , res)=>{
    try{
        // const brand = await Brand.find({}).populate("category");
        const brand2 = await Brand.find({}).populate("category");
        const brandsFilter = brand2.map(singleBrand => {
              const data = singleBrand.category.map((categories)=>({
                  categoryName: categories.categoryName
              }));
              return {
                  _id : singleBrand._id,
                  brandName: singleBrand.brandName,
                  brandStatus: singleBrand.brandStatus,
                  category:data,
                  brandImage : singleBrand.brandImage
              }
        })
        res.send(brandsFilter)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/get-brand/:id' , auth , async (req , res)=>{
    const _id = req.params.id
    try{
        const brands = await Brand.findById(_id).populate('category')
        // const brand = brands.map(()=>{
        //     if(!brands.brandImage){
        //
        //     }else{
        //
        //     }
        // })

        res.send(brands)
        console.log(brand)
    } catch (e) {
        res.status(500).send(e)
    }
})


router.patch('/brand/update/:id' , auth ,async (req , res)=>{
    const _id = req.params.id;
    try{
        const updateBrand = await Brand.findByIdAndUpdate( _id , req.body)
        res.send(updateBrand)
    } catch(e){
        res.status(400).send(e)
    }
})

router.delete('/delete/brand/:id' ,auth , async (req , res)=> {
    const id = req.params.id

    try {

        const products = await Product.find({brandId: id})
        if (products.length) {
            res.status(404).send()
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