const express = require('express')
const router = new express.Router()
const Single = require('./../models/single')
const {auth, isAdmin, isMember, isAll} = require('./../middleware/auth')
const multer = require('multer')

const uploadImg = multer({
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            return cb(new Error('Please upload your image file!'))
        }
        cb(undefined, true)
    }
})

const uploadAudio = multer({
    limits: {
        fileSize: 1000000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(mp3)$/)){
            return cb(new Error('Please upload your mp3 file!'))
        }
        cb(undefined, true)
    }
})

// Create a new single (User + Admin)
router.post('/singles/newSingle', [auth, isAll], uploadAudio.single('audio'), async (req,res) => {
    const single = new Single({
        ...req.body,
        audio: req.file.originalname,
        postBy: req.user._id
    })

    try {
        await single.save()
        res.status(201).send(single)
    }
    catch (e) {
        res.status(400).send(e)
    }
});

// Read all singles (Watcher + isAll)
router.get('/singles/allsingles', async (req, res) => {
    try{
        const singles = await Single.find({}).populate('artistID','name').populate('postBy')
        res.status(200).send(singles)
    }
    catch (e) {
        res.status(500).send(e)
    }
});


// FIND name single (SEARCH FUNCTION)
router.get('/findSingles', async (req, res) => {
    const search_single = req.query.name
    try{
        const res_singles = await Single.find({name: {$regex: search_single, $options: '$i'} })
        res.status(200).send(res_singles)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

// Read a single by ID (Search function for Watcher + User)
router.get('/singles/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const single = await Single.findOne({_id}).populate('artistID','name')
        if(!single) {
            res.status(404).send()
        }
        res.status(200).send(single)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

// GET a single of user who posted those single (only User + Admin)
router.get('/singles/mySingle/:id', [auth, isAll], async (req, res) => {
    const _id = req.params.id

    try {
        const single = await Single.findOne({_id, postBy: req.user._id})
        if(!single) {
            res.status(404).send()
        }
        res.status(200).send(single)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

// GET all singles that posted by User or Admin
router.get('/myAllSingles', [auth, isAll], async (req, res) => {
    try{
        await req.user.populate('singles')
        res.send(req.user.singles)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

// GET all singles of an artist
router.get('/allSingles/artist/:id', async (req, res)=>{
    const _id = req.params.id
    try{
        const allSingle = await Single.find({ artistID: _id }).populate('artistID')
        res.send({allSingle})
    }catch(e){
        res.status(500).send(e)
    }
})

// Update single by ID (only User + Admin)
router.patch('/singles/:id', [auth, isAll], async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ["name","image","audio"]
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))
    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid update!'})
    }
    
    try {
        // const singleUpdate = await Single.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true
        // })

        const singleUpdate = await Single.findOne({ _id: req.params.id, postBy: req.user._id})
        
        if(!singleUpdate) {
            res.status(404).send()
        }
        updates.forEach((update) => singleUpdate[update] = req.body[update])
        await singleUpdate.save()
        res.send(singleUpdate)
    }
    catch (e) {
        res.status(400).send(e)
    }
});

// Delete a single
router.delete('/singles/:id', [auth, isAll], async (req, res) => {
    try {
        const singleDelete = await Single.findOneAndDelete({ _id: req.params.id, postBy: req.user._id})
        if (!singleDelete) {
            return res.status(404).send()
        }
        res.send(singleDelete)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

module.exports = router;