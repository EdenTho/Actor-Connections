const express = require('express');
const app = express();
const tmdb = require('./routes/api/tmdb');
const PORT = process.env.PORT || 3000;
const path = require('path');
const exphbs = require('express-handlebars');

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'routes')));

app.get('/', async (req, res) => {
    
    let movie = await tmdb.getRandomMovie();
    let movieBackdropUrl = movie.backdrop_path;
    let movieTitle = movie.title;
    res.render('index', { title: "Actor Connections", url: 'https://image.tmdb.org/t/p/original' + movieBackdropUrl, urlTitle: movieTitle, urlYear: movie.release_year});
}
);

app.post('/search', async (req, res) => {
    let name1 = req.body.name1;
    let name2 = req.body.name2;
    let movies = (await main(name1, name2));
    res.render('result', { title: "Actor Connections", movies});
})

app.post('/autocomplete', async (req, res) => {
  let possibleMatch = req.body.text;
  let movies = (await autocompleteActorName(possibleMatch));
  res.json(movies);
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

async function main(name, name2){
    let moviesOfActor = await tmdb.getMovieListByActorName(name);
    let moviesOfSecondActor = await tmdb.getMovieListByActorName(name2);

    let intersection = tmdb.getMoviesInCommon(moviesOfActor, moviesOfSecondActor);
    let movieListAsc = await tmdb.getMovieInfo(intersection);
    let movieListDesc = movieListAsc.reverse();
    tmdb.addReleaseYear(movieListDesc);
    return movieListDesc;
}

  async function autocompleteActorName(searchText){
    const res = require("./public/actorsData.json");
    const results = res.results;

    let matches = results.filter(actor => {
      const regex = new RegExp(`^${searchText}`, 'gi');
      return actor.name.match(regex)
    });

    return matches;
}


