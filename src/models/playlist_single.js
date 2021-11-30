const mongoose = require('mongoose')
const validator = require('validator')

const playlistSingleSchema = new mongoose.Schema({
    singleIn: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Single'
    }],
    ofPlaylist: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Playlist'
    }
})

const PlaylistSingle = mongoose.model('PlaylistSingle',playlistSingleSchema)

module.exports = PlaylistSingle;