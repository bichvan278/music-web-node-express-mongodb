const jwt = require('jsonwebtoken')
const User = require('./../models/user')
const { Role } = require('./../models/role')


const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'tokenforuser')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }).populate('role')
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    }
    catch (e) {
        res.status(401).send({ error: 'Please check your authenticate.'})
    }
}

const isAdmin = async (req, res, next) => {
    try{
        const role = await Role.find({_id: req.user.role._id})
        if (role[0].name !== "Admin") {
            throw new Error()
        }
        next()
    }catch(e){
        res.status(500).send('Require Admin Role!')
    }
};

const isMember = async (req, res, next) => {
    try{
        const role = await Role.find({_id: req.user.role._id})
        if (role[0].name !== "Member") {
            throw new Error()
        }
        next()
    }catch(e){
        res.status(500).send('Require Member Role!')
    }
};

const isAll = async (req, res, next) => {
    try{
        const role = await Role.find({_id: req.user.role._id})
        if (role[0].name === "Admin") {
            next()
        }else if (role[0].name === "Member") {
            next() 
        }else if(role[0].name === "Artist") {
            next() 
        } else throw new Error()
    }catch(e){
        res.status(500).send('Require Role!')
    }
};

const authJwt = {
    auth,
    isAdmin,
    isMember,
    isAll
}

module.exports = authJwt;
