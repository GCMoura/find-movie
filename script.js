const BASE_URL = window.location.hostname.includes('localhost')
? 'http://localhost:5000'
: 'https://seek-movie.herokuapp.com'

var body = document.querySelector('.body')
var container = document.querySelector('.container')
var input = document.querySelector('#input')
var button = document.querySelector('#button')
var coverDiv = document.querySelector('.coverDiv')
var loadButton = document.querySelector('.load-button')
var posterMovies

var search
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
  var response

  fetch(`${BASE_URL}/${search}/${page}`, {
      method: 'GET',
      params: {
          search,
          page
      }
    })
    .then(async (serverResponse) => {
      if (serverResponse) {
          response = await serverResponse.json();
          if(response.Response === "False"){
            var message = "Não há filmes com o termo pesquisado"
            showAlert(message, 'danger')
          } else {
            showMovie(response)
            page++
            loadButton.addEventListener('click', getMovieBySearch) //mostra os próximos 10 filmes
          }
        } 
      });
}

function showMovie(movie){
  for(let i = 0; i < movie.Search.length; i++){
    if(movie.Search[i].Poster !== "N/A"){ //somente filmes com poster
      movieData(movie.Search[i].Title)
    }
  }  
}

async function movieData(title){

  var response

  fetch(`${BASE_URL}/${title}`, {
    method: 'GET',
    params: {
      title
    }
  })
  .then(async (serverResponse) => {
    if (serverResponse) {
        response = await serverResponse.json();
        idUnique.push(response.imdbID)      
        var runtimeHandled = handleMovieRuntime(response.Runtime) //verifica filmes com mais de 70 minutos
        var duplicateHandled = handleMovieDuplicated(response.imdbID) //verifica filmes duplicados através do id
        if(runtimeHandled && duplicateHandled){
          createPosterMovies(response)
        }
    } 
  });
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

function createPosterMovies(movie){ //cria as imagens com os posters dos filmes
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

  posterMovies.length % 10 == 0 ? loadButton.style.display = 'block' : loadButton.style.display = 'none'
}

async function highlightMovie(movieID, position){
  
  var response
  var flag = true

  fetch(`${BASE_URL}/${movieID}/${position}/${flag}`, {
    method: 'GET',
    params: {
      movieID
    }
  })
  .then(async (serverResponse) => {
    if (serverResponse) {
        response = await serverResponse.json();
        coverDiv.style.opacity = 0.1
        createMovieHighlightData(response, position)
      } 
    });
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

function showAlert(message, classType) {
  const div = document.createElement('div')

  div.className = `alert alert-${classType}`
  
  div.appendChild(document.createTextNode(message))

  body.appendChild(div)

  setTimeout(() => {
      document.querySelector('.alert').remove()
      coverDiv.innerHTML = ""
      input.value = ""
      loadButton.style.display = 'none'
      page = 1
  }, 3000);    

}