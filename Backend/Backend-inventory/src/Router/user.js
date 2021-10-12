const express = require('express')
const User = require('../Model/user')
const router = new express.Router()
const auth = require('../middleware/authuser')


router.post('/signup/users' , async (req , res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        res.status(201).send({user})
    } catch (e) {
        res.status(401).send(e)
    }

})

router.post('/users/signin',  async (req , res)=>{
    try{
        
        const user = await User.findByCredentials(req.body.email , req.body.password)
        console.log(user)
        // console.log(user)
        const token = await user.generateAuthToken()
        res.send({user , token})
    } catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})


router.post('/user/logout' ,auth , async (req , res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send(req.user)
    } catch(e){
        res.status(500).send()
    }
})

router.get('/user/read' , auth , async (req , res)=>{
    res.send(req.user)
})




module.exports= router