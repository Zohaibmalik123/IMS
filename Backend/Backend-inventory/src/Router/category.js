const express = require('express')
const Category = require('../Model/category')
const Product = require('../Model/product')
const router = new express.Router()
const auth = require('../middleware/authuser')
const Brand = require("../Model/brand");


router.post('/create-category', auth, async (req, res) => {
    try {
        const categoryExists = await Category.find({categoryName: req.body.categoryName})
        // console.log(req.body.categoryName)
        if (categoryExists.length === 0) {
            let resultCategory = null;
            category = new Category()
            category.categoryName = req.body.categoryName
            if (req.body.subCategoryId) {
                resultCategory = await Category.findById(req.body.subCategoryId)
            } else if (req.body.mainCategoryId) {
                resultCategory = await Category.findById(req.body.mainCategoryId)
            }
            if (resultCategory) {
                category.parentCategory = resultCategory
            }
            category.categoryStatus = req.body.categoryStatus

            await category.save()
            console.log("success")
            res.status(201).send(category)

        } else {
            res.status(500).send({message: "Category already exist!"})
        }
    } catch (e) {
        res.status(400).send(e)
    }

})
router.get('/get-all-category' ,auth  , async (req , res)=>{
    try {
        let categories = await Category.find({parentCategory: {$exists: false}})
        const responseCategories = await Promise.all(categories.map(async (category) => {
            subCategories = await Category.find({parentCategory: category._id})
            subCategories1 = await Promise.all(subCategories.map(async (category) => {
                subCategories = await Category.find({parentCategory: category._id})
                return {
                    _id: category._id,
                    categoryName: category.categoryName,
                    categoryStatus: category.categoryStatus,
                    subCategories: subCategories
                }
            }))

            return {
                _id: category._id,
                categoryName: category.categoryName,
                categoryStatus: category.categoryStatus,
                subCategories: subCategories1
            }
        }))
        res.send(responseCategories);
    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/get-main-categories-with-sub-categories', auth, async (req, res) => {
    try {
        let categories = await Category.find({parentCategory: {$exists: false}})
        const responseCategories = await Promise.all(categories.map(async (category) => {
            subCategories = await Category.find({parentCategory: category._id})
            return {
                _id: category._id,
                categoryName: category.categoryName,
                categoryStatus: category.categoryStatus,
                subCategories: subCategories
            }
        }))
        res.send(responseCategories);
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/get-categories/:id?' , auth , async (req,res)=>{
    const _id = req.params.id
    try {
        let categories = [];
        if (_id) {
            categories = await Category.find({parentCategory: _id});
        }else{
            categories = await Category.find({parentCategory: null});
        }
        const responseCategories = await Promise.all(categories.map(async (category) => {
            countSubCategories = await Category.find({parentCategory: category._id}).count();
            return {
                _id: category._id,
                categoryName: category.categoryName,
                categoryStatus: category.categoryStatus,
                countSubCategories: countSubCategories
            }
        }))
        res.send(responseCategories)
    }catch (e){
        res.status(500).send(e)
    }

})

router.get('/get-single-category/:id?' , auth , async (req,res)=>{
    const _id = req.params.id
    try {

        let responseCategory = {
            _id: '',
            categoryName: '',
            categoryStatus: '',
            mainCategoryId: '',
            subCategoryId: ''
        }
        if(_id){
            let category = await Category.findById(_id);
            if(category) {
                responseCategory._id = category._id;
                responseCategory.categoryName = category.categoryName;
                responseCategory.categoryStatus = category.categoryStatus;
                if (category.parentCategory) {
                    parentCategory = await Category.findById(category.parentCategory)
                    if(parentCategory && parentCategory.parentCategory){
                        responseCategory.mainCategoryId = parentCategory.parentCategory;
                        responseCategory.subCategoryId = category.parentCategory;
                        console.log(category.parentCategory)
                    }else{
                        responseCategory.mainCategoryId = category.parentCategory;
                        console.log(category.parentCategory)
                    }

                }
            }
            res.send(responseCategory)

        }
    }catch (e){
        res.status(500).send(e)
    }

})


router.get('/get-categories/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const category = await Category.findById(_id)
        res.send(category)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/category/update/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const updateCategory = await Category.findByIdAndUpdate(_id, req.body)
        res.send(updateCategory)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.delete('/delete/category/:id', auth, async (req, res) => {
    const id = req.params.id

    try {
        const products = await Product.find({categoryId: id})
        if (products.length) {
            res.status(404).send()
        } else {

            const deleteCategory = await Category.findOneAndDelete({_id: id})
            if (!deleteCategory) {
                res.status(404).send()
            }
            res.send(deleteCategory)
        }
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router