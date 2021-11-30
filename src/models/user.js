const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Single = require('./single');

const userSchema =  new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        unique: true,
        maxlength: 20
    },
    email: {
        type: String,
        require: true, 
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
    },
    phone: {
        type: Number,
        trim: true,
        validate(value) {
            if(value < 10 & value > 12) {
                throw new Error('Your phone number is invalid!')
            }
        }
    },
    image: {
        type: Buffer
    },
    username: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Role'
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
},{
    timestamps: true
});

// Relationship between models User and Single
userSchema.virtual('singles', {
    ref:'Single',
    localField: '_id',
    foreignField: 'postBy'
})

// Relationship between models User and Playlist
userSchema.virtual('User_Playlist', {
    ref:'Playlist',
    localField: '_id',
    foreignField: 'createdBy'
})

// Relationship between models User and Comment
userSchema.virtual('User', {
    ref:'Comment',
    localField: '_id',
    foreignField: 'cmtBy'
})

// Hide password and tokens when user signin
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const userAuth = this
    const token = jwt.sign({ _id: userAuth._id.toString() }, 'tokenforuser')

    userAuth.tokens = userAuth.tokens.concat({ token })
    await userAuth.save()

    return token
}

userSchema.statics.findByCredentials = async (username, password) => {
    // const user = await User.find({username, password})
    // if(!user) {
    //     throw new Error('Unable to login')
    // }

    // Code for using Bcrypt password
    const user = await User.findOne({username})
    if(!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}

// Using bcrypt to hash password before signin or signup
userSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
});

// Delete owner's single when user removed
// userSchema.pre('remove', async function(next) {
//     const user = this
//     await Single.deleteMany({ postBy: user._id })
//     next()
// })

const User = mongoose.model('User', userSchema)

module.exports = User