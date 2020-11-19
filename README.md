# Find Movie
Using an API for find data about a movie.

## Table of Contents
- [Find Movie](#find-movie)
  - [Table of Contents](#table-of-contents)
  - [Screenshots (mobile and desktop layout)](#screenshots-mobile-and-desktop-layout)
  - [Getting Started](#getting-started)
  - [How it works](#how-it-works)
  - [API](#api)
  - [Clone](#clone)
  - [Deploy](#deploy)
  - [Contributing](#contributing)
  - [License](#license)

## Screenshots (mobile and desktop layout)
![Screenshot-1](https://github.com/GCMoura/find-movie/blob/main/screenshots/screenshot-1.png)
![Screenshot-2](https://github.com/GCMoura/find-movie/blob/main/screenshots/screenshot-2.png)

## Getting Started
This page was created using only Vanilla Javascript, without frameworks or libraries, therefore for visualizing this page access:

[Find Movie](https://gcmoura.github.io/find-movie/)

## How it works
Search for the keyword in input section. After press Search button, the application connect with API from OMDb (The Open Movie Database), which return all the movies with keyword. If click in the movie poster a new connection with API is done and the data of the movie is show.

## API
This application uses APIs available in [OMDb-API](http://www.omdbapi.com/)

- ### Examples
  * To search for a keyword:
  ```
  http://www.omdbapi.com/?apikey=${apiKey}&s=${keyword}&type=movie
  ```
  * To search for a specific title:
  ```
  http://www.omdbapi.com/?apikey=${apiKey}&t=${movieTitle}&type=movie
  ```

## Clone
Clone this repository to your local machine using https://github.com/GCMoura/find-movie.git

## Deploy
This application was deployed using [Github Pages](https://pages.github.com/).

## Contributing
If you would like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---
Made with :heart: by Gabriel Moura. [Get in touch!](https://www.linkedin.com/in/gabriel-moura-b45b90150/)
