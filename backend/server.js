var express = require('express')
var cors = require('cors')
var jwt = require('jwt-simple')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express()

var User = require('./models/user.js')
var Post = require('./models/post.js')
var auth = require('./auth.js')

mongoose.Promise = Promise

app.use(cors())
app.use(bodyParser.json())

app.get('/posts/:id', async (req,res) => {
    var author = req.params.id
    var posts = await Post.find({author})
    res.send(posts)
})

app.post('/post', auth.checkAuthenticated, (req, res) => {
    var postData = req.body
    postData.author = req.userId

    var post = new Post(postData)

    post.save((err, result) => {
        if(err) {
            console.error('Saving post failed')
            return res.status(500).send({message: 'savng post error'})
        }

        res.sendStatus(200)
    })
})

app.get('/users', auth.checkAuthenticated, async (req,res) => {
    try {
        var users = await User.find({}, '-pwd -__v')
        res.send(users)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

app.get('/profile/:id', async (req,res) => {
    console.log(req.params.id)
    try {
        var user = await User.findById(req.params.id, '-pwd -__v')
        res.send(user)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

mongoose.connect('mongodb://test:testing1@ds018258.mlab.com:18258/jbc-pssocial', {useNewUrlParser: true}, (err) => {
    if(!err)
        console.log('Connected to Mongo')
})

app.use('/auth', auth.router)
app.listen(process.env.PORT || 3000)