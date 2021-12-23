const express = require('express')
const router = new express.Router()
const Comment = require('./../models/comment')
const {auth, isAdmin, isMember, isAll} = require('./../middleware/auth')

// Add comment in a single
router.post('/comment/addCmt', [auth, isMember], async (req,res) => {
    const cmt = new Comment({
        ...req.body,
        cmtBy: req.user._id
    })

    try {
        await cmt.save()
        res.status(201).send(cmt)
    }
    catch (e) {
        res.status(400).send(e)
    }
});

// Read all Comments
router.get('/allComments', async (req, res) => {
    try{
        const cmts = await Comment.find({})
        res.status(200).send(cmts)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

// GET all singles of an artist
router.get('/allComments/single/:id', async (req, res)=>{
    const _id = req.params.id
    try{
        const allCmt = await Comment.find({ cmtofSingle: _id }).populate('cmtofSingle').populate('cmtBy')
        res.send(allCmt)
    }catch(e){
        res.status(500).send(e)
    }
})

// Update Comment by User ID (only User + Admin)
router.patch('/comment/:id', [auth, isAll], async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ["content"]
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))
    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid update!'})
    }
    
    try {
        // const singleUpdate = await Single.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true
        // })

        const cmtUpdate = await Comment.findOne({ _id: req.params.id, cmtBy: req.user._id })
        
        if(!cmtUpdate) {
            res.status(404).send()
        }
        updates.forEach((update) => cmtUpdate[update] = req.body[update])
        await cmtUpdate.save()
        res.send(cmtUpdate)
    }
    catch (e) {
        res.status(400).send(e)
    }
});

// Delete Playlist by ID
router.delete('/comment/:id', [auth, isAll], async (req, res) => {
    try {
        const cmtDelete = await Comment.findOneAndDelete({ _id: req.params.id, cmtBy: req.user._id })
        if (!cmtDelete) {
            return res.status(404).send()
        }
        res.send(cmtDelete)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

module.exports = router;