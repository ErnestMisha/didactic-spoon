import { Sequelize, DataTypes, Model } from 'sequelize';

const sequelize = new Sequelize('swapi', 'swapi', 'swapi', {
    host: 'localhost',
    dialect: 'mysql'
});

export class Person extends Model {}

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

export class Film extends Model {}

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

export class List extends Model {}

List.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'List'
});

export class ListFilms extends Model {}

ListFilms.init({}, {
    sequelize,
    modelName: 'ListFilms'
});

export class FilmPeople extends Model {}

FilmPeople.init({}, {
    sequelize,
    modelName: 'FilmPeople'
});

export async function sync() {
    List.belongsToMany(Film, { through: 'ListFilms' });
    Film.belongsToMany(List, { through: 'ListFilms' });
    Film.belongsToMany(Person, { through: 'FilmPeople' });
    Person.belongsToMany(Film, { through: 'FilmPeople' });
    await List.sync();
    await Film.sync();
    await Person.sync();
    await ListFilms.sync();
    await FilmPeople.sync();
}