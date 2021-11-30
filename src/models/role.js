const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
})

roleSchema.virtual('Role',{
    ref: 'User',
    localField: '_id',
    foreignField: 'role'
})

const Role = mongoose.model('Role',roleSchema)

const initial = () => {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "Member"
            }).save(err => {
                if (err) {
                console.log("error", err);
                }
                console.log("added 'member' to roles collection");
            });
            new Role({
                name: "Admin"
            }).save(err => {
                if (err) {
                console.log("error", err);
                }
                console.log("added 'admin' to roles collection");
            });
          
        }
    });
}

module.exports = {
    Role: Role,
    initial: initial
}