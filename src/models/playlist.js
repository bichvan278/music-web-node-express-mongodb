const mongoose = require('mongoose')
const validate = require('validator')

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        require: true,
        maxlength: 20
    },
    image: {
        type: Buffer
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})

// Relationship between models Playlist and playlistSingle
playlistSchema.virtual('Playlist', {
    ref:'PlaylistSingle',
    localField: '_id',
    foreignField: 'ofPlaylist'
})

const Playlist = mongoose.model('Playlist', playlistSchema)

module.exports = Playlist;