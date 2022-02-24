import { Sequelize, DataTypes, Model } from 'sequelize';
import { readFile } from 'fs/promises';
import { load } from 'js-yaml';

let sequelize;

export async function connect() {
    const file = await readFile('./db-config.yaml');
    const config = await load(file);
    sequelize = new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        dialect: config.dialect
    });
}

export async function close() {
    await sequelize.close();
}

export class Person extends Model {}
export class Film extends Model {}
export class List extends Model {}
export class ListFilms extends Model {}
export class FilmPeople extends Model {}

export function init() {
    Person.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        height: {
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: false
        },
        mass: {
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: false
        },
        hair_color: {
            type: DataTypes.STRING,
            allowNull: false
        },
        skin_color: {
            type: DataTypes.STRING,
            allowNull: false
        },
        eye_color: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birth_year: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
    }, {
        sequelize,
        modelName: 'Person'
    });
    Film.init({
        release_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Film'
    });
    List.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'List'
    });
    ListFilms.init({}, {
        sequelize,
        modelName: 'ListFilms'
    });
    FilmPeople.init({}, {
        sequelize,
        modelName: 'FilmPeople'
    });
    List.belongsToMany(Film, { through: 'ListFilms' });
    Film.belongsToMany(List, { through: 'ListFilms' });
    Film.belongsToMany(Person, { through: 'FilmPeople' });
    Person.belongsToMany(Film, { through: 'FilmPeople' });
}

export async function sync() {
    await List.sync();
    await Film.sync();
    await Person.sync();
    await ListFilms.sync();
    await FilmPeople.sync();
}
