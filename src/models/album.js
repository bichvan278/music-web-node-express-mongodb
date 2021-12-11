const mongoose = require('mongoose')
const validate = require('validator')

const albumSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        require: true,
        maxlength: 20
    },
    alBofArtist: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Artist'
    },
    image: {
        type: String
    },
    release: { 
        type: Date, 
        default: Date.now 
    }
},{
    timestamps: true
})

// Relationship between models Alnum and albumSingle  
albumSchema.virtual('Album', {
    ref:'AlbumSingle',
    localField: '_id',
    foreignField: 'ofAlbum'
})

const Album = mongoose.model('Album', albumSchema)

module.exports = Album;