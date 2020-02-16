const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const writeStream = fs.createWriteStream('actorsData.json');

writeStream.write(`{
    "results": [`);

request("https://www.imdb.com/search/name/?gender=male,female&ref_=rlm", function(error, res, html) {
    if(!error && res.statusCode == 200){
        const $ = cheerio.load(html);
        const output =  $(".lister-item.mode-detail").each((i, el) => {
            let actor = {
                "name" : $(el).find("h3 a").text().trim(),
                "known_for": [$(el).find(".text-muted a").text().trim()]
            }

            let data = JSON.stringify(actor);
            writeStream.write(`${data},`);
        });
        console.log(`Done with first page`);
        
    }

});

for(let i = 51; i <= 2001; i += 50){
    let imdbUrl = getUrl(i);
    request(imdbUrl, function(error, res, html) {
        if(!error && res.statusCode == 200){
            const $ = cheerio.load(html);
            const output =  $(".lister-item.mode-detail").each((i, el) => {
                let actor = {
                    "name" : $(el).find("h3 a").text().trim(),
                    "known_for": [$(el).find(".text-muted a").text().trim()]
                }

                let data = JSON.stringify(actor);
                writeStream.write(`${data},`);
            });
            console.log(`Done with ${i}`);
            
        }
  
    });
}

console.log("done scraping");

function getUrl(page){
    return `https://www.imdb.com/search/name/?gender=male,female&start=${page}&ref_=rlm`;
}