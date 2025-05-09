// src/environments/environment.ts
export const environment = {
    production: false,
    apiConfig: {
        url: 'https://imdb236.p.rapidapi.com/imdb/search',
        headers: {
            'x-rapidapi-key': 'a68c72c70cmsheda119d0ebbf595p1eea68jsn571b77757908',
            'x-rapidapi-host': 'imdb236.p.rapidapi.com'
        },
        defaultParams: {
            type: 'movie',
            genre: 'Drama',
            rows: '25'
        }
    }
};