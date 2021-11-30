const mongoose = require('mongoose')
const {Role} = require('./../models/role')

mongoose.connect('mongodb://localhost:27017/vue-mongodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connect to MongoDB.");
}).catch(err => {
    console.error("Connection error", err);
    process.exit();
});
