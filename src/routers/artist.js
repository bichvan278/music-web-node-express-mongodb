const express = require('express')
const router = new express.Router()
const Artist = require('./../models/artist')
const {auth, isAdmin, isMember, isAll} = require('./../middleware/auth')
const multer = require('multer')

// Create a new artist
const uploadArtist = multer({
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

router.post('/artist/newArtist', [auth, isAll], async (req, res) => {
    const artist = new Artist({
        ...req.body
    })
    try {
        await artist.save()
        res.status(201).send(artist)
    }
    catch (e) {
        res.status(400).send(e)
    }
});

// Count all artist (Admin)
router.get('/artists/countAllArtist', async (req,res) => {
    try {
        const count_artists = await Artist.estimatedDocumentCount()
        res.status(200).send({count_artists})
    }
    catch (e) {
        res.status(500).send(e)
    }
})

// Read all artist
router.get('/allArtist', async (req,res) => {
    try {
        const artists = await Artist.find({})
        res.status(200).send(artists)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

// Read image of artist by ID
router.get('/artist/:id/image', async (req, res) => {
    const _id = req.params.id
    try {
        const img = await Artist.findById({_id})
        const getImg = img.image;
        console.warm(getImg)
        res.set('Content-Type', 'image/jpg')
        res.send(getImg)
    } 
    catch (e) {
        res.status(500).send(e)
    }
});

// Read artist by ID
router.get('/artist/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const artist = await Artist.findById(_id)
        if(!artist) {
            res.status(404).send()
        }
        res.status(200).send(artist)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

// FIND name Artist (SEARCH FUNCTION)
router.get('/findArtist', async (req, res) => {
    const search_artist = req.query.name
    try{
        const res_artists = await Artist.find({name: {$regex: search_artist, $options: '$i'} })
        res.status(200).send(res_artists)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

// Update artist by ID (only Admin)
router.patch('/artist/:id', async (req, res) => {
    // console.log(req.body);
    const updates = Object.keys(req.body)
    const allowedUpdate = ["name","image","dob","description"]
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))
    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid update!'})
    }
    
    try {
        // const singleUpdate = await Single.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true
        // })

        const artistUpdate = await Artist.findOne({ _id: req.params.id })
        
        if(!artistUpdate) {
            res.status(404).send()
        }
        updates.forEach((update) => artistUpdate[update] = req.body[update])
        await artistUpdate.save()
        res.send(artistUpdate)
    }
    catch (e) {
        res.status(400).send(e)
    }
});

// Delete artist by ID
router.delete('/artist/deleteArtist/:id', [auth, isAll], async (req, res) => {
    try {
        const artistDelete = await Artist.findOneAndDelete({ _id: req.params.id })
        if (!artistDelete) {
            return res.status(404).send()
        }
        res.send(artistDelete)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

module.exports = router;