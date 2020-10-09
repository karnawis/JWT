require('dotenv').config()
const { response } = require('express');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json())

const posts = [ 
    {
        username: 'Sura',
        title: 'Kittie Post'
    },
    {
        username: 'Kittie',
        title: 'Feminisim post'
    }
]

//middleware
const authenticateToken = (request, response, next) => {

  const authHeader = request.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  console.log(authHeader, 'token', token)
  if (token == null) return response.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    console.log(error)
    if(error) return response.sendStatus(401)
    request.user = user
    console.log('user', user)
    next()
  })
}

//Routes
app.post('/login', (request, response) => {
    //authenticate just user
    const username = request.body.username
    const title = request.body.title;
    const user = { name: username, title: title }

    //we need secret key
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    response.json({ accessToken: accessToken })
})

app.get('/posts', authenticateToken, (request, response) => {
  response.json(posts.filter(post => post.username === request.user.name))
})

app.listen(3000)