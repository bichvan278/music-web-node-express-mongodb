const mongoose = require('mongoose')
const validator = require('validator')

const singleSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        require: true,
        maxlength: 20
    },
    artistID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Artist'
    },
    image: {
        type: String
    },
    audio: {
        type: Buffer
    },
    postBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})

// Relationship between models PlaylistSingle and Single
singleSchema.virtual('Single', {
    ref:'PlaylistSingle',
    localField: '_id',
    foreignField: 'singleIn'
})

// Relationship between models AlbumSingle and Single
singleSchema.virtual('Single', {
    ref:'AlbumSingle',
    localField: '_id',
    foreignField: 'singleInAlb'
})

// Relationship between models Comment and Single
singleSchema.virtual('Single', {
    ref:'Comment',
    localField: '_id',
    foreignField: 'cmtofSingle'
})

const Single = mongoose.model('Single', singleSchema)

module.exports = Single;