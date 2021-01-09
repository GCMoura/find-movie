const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const axios = require('axios')
const server = express()
const router = express.Router()

server.use(cors())
server.use(express.json({extend: true}))

dotenv.config()

const api_key = process.env.API_KEY
const port = process.env.PORT || 5000

router.get('/:search/:page', async (req, res) => {

  const { search } = req.params
  const { page } = req.params

  axios.get(`https://www.omdbapi.com/?apikey=${api_key}&s=${search}&type=movie&page=${page}`)
    .then(response => {
      res.send(response.data)
    })
  
})

router.get('/:title', (req, res) => {
  const { title } = req.params

  axios.get(`https://www.omdbapi.com/?apikey=${api_key}&t=${title}&type=movie`)
    .then(response => {
      res.send(response.data)
  })
})

router.get('/:movieID/:position/:flag', (req, res) => {
  const { movieID } = req.params

  axios.get(`https://www.omdbapi.com/?apikey=${api_key}&i=${movieID}&type=movie`)
    .then(response => {
      res.send(response.data)
  })
})

server.use(router)

server.listen(port, () => {
  console.log(`Server working on port ${port}`)
})