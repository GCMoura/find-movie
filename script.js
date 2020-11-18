var body = document.querySelector('.body')
var container = document.querySelector('.container')
var input = document.querySelector('#input')
var button = document.querySelector('#button')
var coverDiv = document.querySelector('.coverDiv')
var loadButton = document.querySelector('.load-button')
var posterMovies

const apiKey = "881f52d8"
var search
var movie
var idUnique = []
var page = 1

button.addEventListener('click', getMovieBySearch)

input.addEventListener('focus', () => {
  coverDiv.innerHTML = ""
  input.value = ""
  loadButton.style.display = 'none'
  page = 1
})

async function getMovieBySearch() {
  
  search = input.value

  const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${search}&type=movie&page=${page}`

  const res = await fetch(url)

  console.log('First request: ', res.status)

  movie = await res.json()

  showMovie(movie)
  page++
  loadButton.addEventListener('click', getMovieBySearch) //mostra os próximos 10 filmes
}

function showMovie(movie){
  for(let i = 0; i < movie.Search.length; i++){
    if(movie.Search[i].Poster !== "N/A"){ //somente filmes com poster
      movieData(movie.Search[i].Title)
    }
  }  
}

async function movieData(movieTitle){
  
  const url = `http://www.omdbapi.com/?apikey=${apiKey}&t=${movieTitle}&type=movie`
  
  const res = await fetch(url)

  console.log('Second request: ', res.status)
  
  movie = await res.json()

  idUnique.push(movie.imdbID)

  var runtimeHandled = handleMovieRuntime(movie.Runtime) //verifica filmes com mais de 70 minutos

  var duplicateHandled = handleMovieDuplicated(movie.imdbID) //verifica filmes duplicados através do id
    
  if(runtimeHandled && duplicateHandled){
    createPosterMovies()
  }
}

function handleMovieRuntime(runtime){ //filmes com mais de 70 minutos
  if(runtime !== "N/A"){
    let timeSplit = runtime.split(' ')
    let timeNumber = Number(timeSplit[0]) //runtime em inteiro
    if(timeNumber >= 70){
      return true
    } 
  } 
}

function handleMovieDuplicated(id){ //verifica duplicidade de filmes
  let count = 0
  for(let i = 0; i < idUnique.length; i++){
    if(idUnique[i] === id){
      count++
    }
  }
  if(count == 1){
    return true
  }
}

function createPosterMovies(){ //cria as imagens com os posters dos filmes
  var cover = document.createElement('div')
  cover.classList.add('cover')

  var imgCover = document.createElement('img')
  imgCover.classList.add('imgCover')
  imgCover.setAttribute('src', `${movie.Poster}`)
  imgCover.setAttribute('id', `${movie.imdbID}`)

  cover.appendChild(imgCover)
  coverDiv.appendChild(cover)
  
  imgCover.classList.add(`${imgCover.offsetTop}`)

  imgCover.addEventListener('click', function(){highlightMovie(imgCover.id, imgCover.classList[1])})

  posterMovies = document.querySelectorAll('.imgCover')

  // posterMovies.forEach(poster => {
  //   poster.addEventListener('click', function(){highlightMovie(poster.id, poster.classList[1])})
  // })

  // if(posterMovies.length % 10 === 0 || posterMovies.length < 10){    
  //   posterMovies.forEach(poster => {
  //     poster.addEventListener('click', function(){highlightMovie(poster.id, poster.classList[1])})
  //   })
  // }
  posterMovies.length % 10 == 0 ? loadButton.style.display = 'block' : loadButton.style.display = 'none'
}

async function highlightMovie(movieID, position){
  console.log('Filme selecionado: ', movieID)
  const url = `http://www.omdbapi.com/?apikey=${apiKey}&i=${movieID}&type=movie`
  
  const res = await fetch(url)

  console.log('Third request: ', res.status)
  
  movie = await res.json()

  coverDiv.style.opacity = 0.1

  createMovieHighlightData(movie, position)
}

function createMovieHighlightData(movie, position){
  var movieHighlight = document.createElement('div')
  movieHighlight.classList.add('movie-highlight')

  movieHighlight.style.top = `${position}px`

  var movieHighlightCover = document.createElement('img')
  movieHighlightCover.classList.add('movie-highlight-cover')
  movieHighlightCover.setAttribute('src', `${movie.Poster}`)

  var closeButton = document.createElement('button')
  closeButton.classList.add('close-button')
  closeButton.innerHTML = 'Fechar'

  movieHighlight.appendChild(movieHighlightCover)
  
  body.appendChild(movieHighlight)
  
  movieHighlight.innerHTML += `
  </br>
  <strong>Título:</strong> ${movie.Title} </br>
  <strong>Lançamento:</strong> ${movie.Year} </br>
  <strong>Duração:</strong> ${movie.Runtime} </br>
  <strong>Direção:</strong> ${movie.Director} </br> 
  <strong>Atores:</strong> ${movie.Actors} </br>
  <strong>Gênero:</strong> ${movie.Genre} </br>
  <strong>Nota IMDB:</strong> ${movie.Ratings[0].Value}
  `
  movieHighlight.appendChild(closeButton)

  closeButton.addEventListener('click', () => {
    movieHighlight.style.display = 'none'
    coverDiv.style.opacity = 1
  })
}
