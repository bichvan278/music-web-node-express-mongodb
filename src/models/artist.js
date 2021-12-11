const mongoose = require('mongoose')
const validate = require('validator')

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        require: true,
        maxlength: 20
    },
    image: {
        type: String
    },
    dob: {
        type: Date
    },
    description: {
        type: String,
        maxlength: 250
    }
},{
    timestamps: true
})

// Relationship between models Artist and Single  
artistSchema.virtual('Artist', {
    ref:'Single',
    localField: '_id',
    foreignField: 'artistID'
})

// Relationship between models Artist and Album  
artistSchema.virtual('Artist', {
    ref:'Album',
    localField: '_id',
    foreignField: 'alBofArtist'
})

const Artist = mongoose.model('Artist', artistSchema)

module.exports = Artist;