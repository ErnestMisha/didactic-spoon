import express from 'express';
import axios from 'axios';
import createError from 'http-errors';

export const router = express.Router();

router.get('/films', async (req, res, next) => {
    let films;
    try {
        films = await axios.get('https://swapi.dev/api/films');
        if(!films) {
            next(createError(404));
        }
    }
    catch(err) {
        next(createError(500));
    }
    const list = [];
    let id = 0;
    films.data.results.forEach(film => {
        list.push({
            release_date: film.release_date,
            title: film.title,
            id: ++id
        });
    });
    res.send({ films: list });
});

router.post('/favorites', async (req, res, next) => {
    res.end();
});
