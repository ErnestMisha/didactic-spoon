# didactic-spoon

## About project

didactic-spoon is backend REST API integrated with https://swapi.dev API

### App consists of the following endpoints

#### GET /films

This endpoint reads video list from the https://swapi.dev, in response send to user the list of films

#### POST /favorites

This endpoint accepts JSON data with "ids" and "name" fields, in response create list of movie in database

#### GET /favorites

Result of this query is a list of favorites films lists

#### GET /favorites/:id

Result of this query is a detailed list of favorites films with the given id
