var container = document.querySelector('.container')
var input = document.querySelector('#input')
var button = document.querySelector('#button')
var coverDiv = document.querySelector('.coverDiv')

const apiKey = "881f52d8"
var search
var movie
var idUnique = []
var page = 1

button.addEventListener('click', getMovieBySearch)

input.addEventListener('focus', () => {
  coverDiv.innerHTML = ""
})

async function getMovieBySearch() {
  
  search = input.value

  const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${search}&type=movie&page=${page}`

  const res = await fetch(url)

  if(res.status === 200){
    movie = await res.json()

    console.log(movie)
  
    showMovie(movie)
  
    page++
    if(page <= Math.floor(movie.totalResults / 10 + 1)){
      getMovieBySearch()
    } else {
      page = 1
      input.value = ""
    }
  } 
}

function showMovie(movie){
  for(let i = 0; i < movie.Search.length; i++){
    if(movie.Search[i].Poster !== "N/A"){ //somente filmes com poster
      
      movieData(movie.Search[i].Title)
      
      //imgPoster.addEventListener('click', function(){movieData(movie.Search[i].Title)})
    }
  }
}

async function movieData(movieTitle){
  
  const url = `http://www.omdbapi.com/?apikey=${apiKey}&t=${movieTitle}&type=movie`
  
  const res = await fetch(url)
  
  movie = await res.json()

  idUnique.push(movie.imdbID)

  var runtimeHandled = handleMovieRuntime(movie.Runtime) //verifica filmes com mais de 70 minutos

  var duplicateHandled = handleMovieDuplicated(movie.imdbID) //verifica filmes duplicados através do id
    
  if(runtimeHandled && duplicateHandled){
    
    var cover = document.createElement('div')
    cover.classList.add('cover')

    var imgCover = document.createElement('img')
    imgCover.classList.add('imgCover')
    imgCover.setAttribute('src', `${movie.Poster}`)

    cover.appendChild(imgCover)
    coverDiv.appendChild(cover)
  }
}

function handleMovieRuntime(runtime){
  if(runtime !== "N/A"){
    let timeSplit = runtime.split(' ')
    let timeNumber = Number(timeSplit[0]) //runtime em número
    if(timeNumber >= 70){
      return runtime
    } 
  } 
}

function handleMovieDuplicated(id){
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

