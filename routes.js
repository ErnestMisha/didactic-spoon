import express from 'express';
import axios from 'axios';
import createError from 'http-errors';
import { List, Film, Person, ListFilms, FilmPeople } from './models.js';

export const router = express.Router();

router.get('/films', async (req, res, next) => {
    let films;
    try {
        films = await axios.get('https://swapi.dev/api/films');
        if(!films) {
            return next(createError(404));
        }
    }
    catch(err) {
        return next(createError(500));
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
    if(!req.body.ids || !req.body.name) {
        return next(createError(400));
    }
    let ids;
    if(Array.isArray(req.body.ids)) {
        ids = [...new Set(req.body.ids)];
    }
    else {
        ids = [req.body.ids];
    }
    let list;
    try {
        list = await List.findOne({
            where: {
                name: req.body.name
            }
        });
    }
    catch(err) {
        return next(createError(500));
    }
    if(list) {
        return next(createError(403));
    }
    for(const id of ids) {
        let film;
        try {
            film = await Film.findByPk(id);
        }
        catch(err) {
            return next(createError(500));
        }
        if(!film) {
            try {
                film = await axios.get(`https://swapi.dev/api/films/${id}`);
                await Film.create({
                    id,
                    release_date: film.data.release_date,
                    title: film.data.title
                });
            }
            catch(err) {
                return next(createError(400));
            }
            for(const character of film.data.characters) {
                const personId = character.split('/')[5];
                let person;
                try {
                    person = await Person.findByPk(personId);
                    if(!person) {
                        person = await axios.get(character);
                        await Person.create({
                            id: personId,
                            name: person.data.name,
                            height: person.data.height,
                            mass: person.data.mass,
                            hair_color: person.data.hair_color,
                            skin_color: person.data.skin_color,
                            eye_color: person.data.eye_color,
                            birth_year: person.data.birth_year,
                            gender: person.data.gender
                        });
                    }
                    await FilmPeople.create({
                        FilmId: id,
                        PersonId: personId
                    });
                }
                catch(err) {
                    return next(createError(500));
                }
            }
        }
    }
    try {
        list = await List.create({
            name: req.body.name
        });
        for(const id of ids) {
            await ListFilms.create({
                ListId: list.id,
                FilmId: id
            });
        }
    }
    catch(err) {
        return next(createError(500));
    }
    res.end();
});

router.get('/favorites', async (req, res, next) => {
    let lists;
    const resList = [];
    try {
        lists = await List.findAll();
    }
    catch(err) {
        return next(createError(500));
    }
    if(lists) {
        for(const list of lists) {
            resList.push({
                id: list.id,
                name: list.name
            });
        }
    }
    res.send({
        lists: resList
    });
});
