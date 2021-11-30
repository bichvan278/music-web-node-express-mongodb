const mongoose = require('mongoose')
const validate = require('validator')

const cmtSchema = new mongoose.Schema({
    content: {
        type: String,
        require: true,
        maxlength: 150
    },
    cmtBy: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    cmtofSingle: { 
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Single' 
    }
},{
    timestamps: true
})

// Relationship between models Comment and CommentSingle
// cmtSchema.virtual('Comment', {
//     ref:'CommentSingle',
//     localField: '_id',
//     foreignField: 'allCmt'
// })

const Comment = mongoose.model('Comment', cmtSchema)

module.exports = Comment;