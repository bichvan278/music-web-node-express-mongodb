const express = require('express')
const router = new express.Router()
const User = require('./../models/user')
const {auth} = require('./../middleware/auth')
const {Role} = require('../models/role')

// Create a new user (SignUp)
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }
    catch (e) {
        res.status(400).send(e)
    }
});

// SignIn 
router.post('/users/signin', async (req, res) => {
    try {
        const userLogin = await User.findByCredentials(req.body.username, req.body.password)
        const role = await Role.findOne({_id: userLogin.role})
        const token = await userLogin.generateAuthToken()
        res.send({ userLogin, role, token})
    }
    catch (e) {
        res.status(400).send(e)
    }
});

// User SignOut
router.post('/users/signout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    }
    catch (e) {
        res.status(500).send(e)
    }
})

// User LogOut all access
router.post('/users/signoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch (e) {
        res.status(500).send(e)
    }
})

// Read profile user (same GET user by ID)
router.get('/users/me', auth, async (req, res) => {
    // try {
    //     const users = await User.find({})
    //     res.status(200).send(users)
    // }
    // catch (e) {
    //     res.status(500).send(e)
    // }
    res.send(req.user)
});

// Read a user by ID
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id)
        if(!user) {
            res.status(404).send()
        }
        res.status(200).send(user)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

// Update user by ID
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ["fullname","email","phone","username","password"]
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))
    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid update!'})
    }
    
    try {
        // const userUpdate = await User.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true
        // })

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    }
    catch (e) {
        res.status(400).send(e)
    }
});

// Delete a user
router.delete('/users/me', auth, async (req, res) => {
    try {
        // const userDelete = await User.findByIdAndDelete(req.params.id)
        // if (!userDelete) {
        //     return res.status(404).send()
        // }
        await req.user.remove()
        res.send(req.user)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

module.exports = router;