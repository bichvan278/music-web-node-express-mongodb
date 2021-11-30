const mongoose = require('mongoose')
const validator = require('validator')

const albumSingleSchema = new mongoose.Schema({
    singleInAlb: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Single'
    }],
    ofAlbum: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Album'
    }
})

const AlbumSingle = mongoose.model('AlbumSingle',albumSingleSchema)

module.exports = AlbumSingle;