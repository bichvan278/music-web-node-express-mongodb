const express = require('express');
const cors = require('cors');
require('./db/mongoose')
const userRouter = require('./routers/user');
const singleRouter = require('./routers/single');
const albumRouter = require('./routers/album');
const artistRouter = require('./routers/artist');
const playlistRouter = require('./routers/playlist');
const cmtRouter = require('./routers/comment');

const app = express();
const port = process.env.PORT || 3000;

var corsOptions = {
    origin: "http://localhost:8080"
};
  
app.use(cors(corsOptions));

app.use(express.json());
app.use(userRouter);
app.use(singleRouter);
app.use(albumRouter);
app.use(artistRouter);
app.use(playlistRouter);
app.use(cmtRouter);

app.listen(port, () => {
    console.log('Server is running on '+ port)
});


const User = require('./models/user')
const Single = require('./models/single')
const Artist = require('./models/artist')


// Get user by user ID in single document
// const test = async () => {
//     const user = await Single.findOne({ postBy: '618ea109a1c05d89b977ae1e'}).populate('postBy')
//     console.log(user.postBy.fullname)
// }
// test()

// GET artist by artist ID in single document
// const test = async () => {
//     const singles = await Single.findOne({_id: '619cb33c2a0a024b95cd4a6b'}).populate('artistID')
//     console.log(singles.artistID.name)
// }
// test()




// const multer = require('multer')
// const upload = multer({
//     "dest": "uploads/images/singles"
// })
// app.post('/test', upload.single('test'), (req, res) => {
//     res.send()
// })