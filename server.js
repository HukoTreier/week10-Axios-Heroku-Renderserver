const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs'); // täpsustab view enginet
app.use(express.static('public')); // mis kaustast tohib faile saata, css koos html

app.get('/', (req, res) => { // get päringute haldamine, /-pealeht. req- kasutaja päring, res- serveri vastus
    let url = 'https://api.themoviedb.org/3/movie/157336?api_key=8d99420b04a2ec7a516f47042c2691aa'; // kust andmeid võetakse, let sest const ei saa hiljem muuta. võtit enam kätte ei saa- serveripoolne
    axios.get(url) // axios haldab get päringut
    .then(response => { // paneb koodi ootele kuni serverilt on vastus käes
        let data = response.data; // muutujasse data salvestatakse objekt response.data
        let releaseDate = new Date(data.release_date).getFullYear();
        
        let genresToDisplay = '';
        data.genres.forEach(genre => { // iga genre jaoks, mis asub massiivis genres
            genresToDisplay = genresToDisplay + `${genre.name}, `; // kleebib üles tühja väärtuse sisse, loopides
        });
        let genresUpdated = genresToDisplay.slice(0, -2) + '.'; // lõikab viimase elemendi (,) välja ja asendab/liidab .
        let posterUrl = `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${data.poster_path}`; // asendab url lõpu


        let currentYear = new Date().getFullYear();

        res.render('index', { // vasta kuva index.ejs (html) failiga. Datatorender muutujasse salvestatakse andmete tükk. year=currentyear
            dataToRender: data,
            year: currentYear,
            releaseYear: releaseDate, // releaseYear muutujasse salvestatakse date andmed
            genres: genresUpdated,
            poster: posterUrl // annab posterurl edasi
        
        }); 
    });

});

app.listen(process.env.PORT || 3000, () => { // kui tuleb päring portile 3000. process.env.PORT vajalik serverile, et avaldada leht (vabadus valida enda port)
    console.log('Server is running on Port 3000.');
});