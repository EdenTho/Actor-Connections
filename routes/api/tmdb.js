const rp = require('request-promise');
const APIKEY = process.env.APIKEY;

async function getMovieListByActorName(name){
    const actorRes = await rp(`https://api.themoviedb.org/3/search/person?api_key=${APIKEY}&query=` + encodeURIComponent(name));
    let actorJson = JSON.parse(actorRes);
    let actorId = actorJson.results[0].id;

    const response = await rp(`https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${APIKEY}`);
    let json = JSON.parse(response);
    let movieIds = [];

    for(i = 0; i <= json.cast.length - 1; i++){
          movieIds.push(json.cast[i].id);
      }

    return movieIds;
}

function getMoviesInCommon(movieList, movieList2){
return movieList.filter(element => movieList2.includes(element));
}

function addReleaseYear(jsonArray){
    jsonArray.forEach(element => {
        element.release_year = element.release_date.substring(0,4);
    });
    return jsonArray;
}

async function getMovieInfo(movieIds){
let movieDetailsArray = [];
for(const movieId of movieIds){
    let response = await rp(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${APIKEY}`);
    response = JSON.parse(response);
    movieDetailsArray.push(response);

}

//Do not recommend creating new Date objects inside the sort method. Have hit production performance issues specifically for that reason. Do not allocate memory (and GC) inside a sort method.
movieDetailsArray.sort((a, b) => {
    return new Date(a.release_date) - new Date(b.release_date); 
})
return movieDetailsArray;
}

async function getRandomMovie(){
    let currentYear = new Date().getFullYear();
    let randomYear = randomNumber(1980, currentYear);
    let movieRes = await rp(`https://api.themoviedb.org/3/discover/movie?api_key=${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_year=${randomYear}`);
    let movieJson = JSON.parse(movieRes);
    let resArrayLength = movieJson.results.length;
    let randomIndex = randomNumber(1, resArrayLength+1) - 1;
    let result = movieJson.results[randomIndex];
    result.release_year = randomYear;
    return result;

}

function randomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

module.exports = {getMovieListByActorName, getMoviesInCommon, addReleaseYear, getMovieInfo, getRandomMovie};
