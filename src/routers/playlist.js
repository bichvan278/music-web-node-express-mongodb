const express = require('express')
const router = new express.Router()
const Playlist = require('./../models/playlist')
const Playlist_Single = require('./../models/playlist_single')
const {auth, isAdmin, isMember, isAll} = require('./../middleware/auth')
const multer = require('multer')

// Create a new Playlist (User + Admin)
const uploadPlaylist = multer({
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

router.post('/playlist/newPlaylist', [auth, isAll], uploadPlaylist.single('image'), async (req,res) => {
    const playlist = new Playlist({
        ...req.body,
        image: req.file.originalname,
        createdBy: req.user._id
    })

    try {
        await playlist.save()
        res.status(201).json({playlist})
    }
    catch (e) {
        res.status(400).send(e)
    }
});

// ADD singles into Playlist
router.post('/playlist/addSingleintoPlaylist', [auth,isAll], async (req, res) =>{
    const addSingleintoPlaylist = new Playlist_Single(req.body)
    try{
        await addSingleintoPlaylist.save()
        res.status(201).send({addSingleintoPlaylist})
    }catch(e){
        res.status(500).send(e)
    }
});

// Read a Playlist by ID (Search function for Watcher + User)
router.get('/playlist/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const playlist = await Playlist.findById(_id).populate('createdBy','username')
        if(!playlist) {
            res.status(404).send()
        }
        res.status(200).send(playlist)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

//Read singles in Playlist ID
router.get('/playlist/getAllSinglesinPlaylist/:id', async (req, res)=>{
    const _id = req.params.id
    try{
        const getAllsingles = await Playlist_Single.find({ ofPlaylist: _id }).populate('singleIn')
        res.send({getAllsingles})
    }catch(e){
        res.status(500).send(e)
    }
})

// Read all Playlists
router.get('/allPlaylists', async (req, res) => {
    try{
        const playlists = await Playlist.find({}).populate('createdBy','username')
        res.status(200).send(playlists)
    }
    catch (e) {
        res.status(500).send(e)
    }
});


// GET all Playlists that posted by User or Admin
router.get('/myAllPlaylist', [auth, isAll], async (req, res) => {
    try{
        await req.user.populate('User_Playlist') 
        res.send(req.user.User_Playlist)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

// FIND name Playlist (SEARCH FUNCTION)
router.get('/findPlaylist', async (req, res) => {
    const search_playlist = req.query.name
    try{
        const res_playlists = await Playlist.find({name: {$regex: search_playlist, $options: '$i'} })
        res.status(200).send(res_playlists)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

// Update Playlist by ID (only User + Admin)
router.patch('/playlist/:id', [auth, isAll], async (req, res) => {
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

        const playlistUpdate = await Playlist.findOne({ _id: req.params.id })
        
        if(!playlistUpdate) {
            res.status(404).send()
        }
        updates.forEach((update) => playlistUpdate[update] = req.body[update])
        await playlistUpdate.save()
        res.send(playlistUpdate)
    }
    catch (e) {
        res.status(400).send(e)
    }
});

// Delete Playlist by ID
router.delete('/playlist/deletePlaylist/:id', [auth, isAll], async (req, res) => {
    try {
        const playlistDelete = await Playlist.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id })
        if (!playlistDelete) {
            return res.status(404).send()
        }
        res.send(playlistDelete)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

module.exports = router;