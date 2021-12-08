const express = require('express')
const router = new express.Router()
const Album = require('./../models/album')
const Alb_Single = require('./../models/album_single')
const {auth, isAdmin, isMember, isAll} = require('./../middleware/auth')
const multer = require('multer')

// Create a new album (User + Admin)
const uploadAlbum = multer({
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

router.post('/album/newAlbum', [auth, isAdmin], uploadAlbum.single('image'), async (req,res) => {
    const album = new Album({
        ...req.body,
        image: req.file
    })

    try {
        await album.save()
        res.status(201).send(album)
    }
    catch (e) {
        res.status(400).send(e)
    }
});

// ADD singles into Album
router.post('/album/addSingleintoAlbum', [auth,isAdmin], async (req, res) =>{
    const addSingleintoAlbum = new Alb_Single(req.body)
    try{
        await addSingleintoAlbum.save()
        res.status(201).send({addSingleintoAlbum})
    }catch(e){
        res.status(500).send(e)
    }
});

//Read singles in an album 
router.get('/album/getAllSinglesinAlbum/:id', async (req, res)=>{
    const _id = req.params.id
    try{
        const getAllsingles = await Alb_Single.find({ ofAlbum: _id }).populate('singleInAlb').populate('ofAlbum','name')
        res.send({getAllsingles})
    }catch(e){
        res.status(500).send(e)
    }
})

// Count all albums (Admin)
router.get('/albums/countAllAlbums', async (req, res) => {
    try{
        const count_albums = await Album.estimatedDocumentCount()
        res.status(200).send({count_albums})
    }
    catch (e) {
        res.status(500).send(e)
    }
});

// Read all albums
router.get('/allAlbums', async (req, res) => {
    try{
        const albums = await Album.find({}).populate('alBofArtist','name')
        res.status(200).send(albums)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

// Read a album by ID (Search function for Watcher + User)
router.get('/album/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const album = await Album.findById(_id).populate('alBofArtist','name').populate('image','data')
        if(!album) {
            res.status(404).send()
        }
        res.status(200).send(album)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

// Read all album by Artist ID (Search function for Watcher + User)
router.get('/album/getAlbumsofArtist/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const albumofArt = await Album.find({ alBofArtist: _id }).populate('alBofArtist')
        if(!albumofArt) {
            res.status(404).send()
        }
        res.status(200).send({albumofArt})
    }
    catch (e) {
        res.status(500).send(e)
    }
});

// FIND name Album (SEARCH FUNCTION)
router.get('/findAlbum', async (req, res) => {
    const search_album = req.query.name
    try{
        const res_albums = await Album.find({name: {$regex: search_album, $options: '$i'} })
        res.status(200).send(res_albums)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

// GET all albums that posted by User or Admin (unusual)
router.get('/myAlbum', [auth, isAdmin], async (req, res) => {
    try{
        await req.user.populate('Album') 
        res.send(req.user.Album)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

// Update Album by ID (only User + Admin)
router.patch('/album/:id', [auth, isAdmin], async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ["name","image"]
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))
    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid update!'})
    }
    
    try {
        // const singleUpdate = await Single.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true
        // })

        const albumUpdate = await Album.findOne({ _id: req.params.id })
        
        if(!albumUpdate) {
            res.status(404).send()
        }
        updates.forEach((update) => albumUpdate[update] = req.body[update])
        await albumUpdate.save()
        res.send(albumUpdate)
    }
    catch (e) {
        res.status(400).send(e)
    }
});

// Delete Album by ID
router.delete('/album/deleteAlbum/:id', [auth, isAdmin], async (req, res) => {
    try {
        const albumDelete = await Album.findOneAndDelete({ _id: req.params.id })
        if (!albumDelete) {
            return res.status(404).send()
        }
        res.send(albumDelete)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

module.exports = router;