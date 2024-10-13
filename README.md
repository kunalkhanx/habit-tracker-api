# Habit Tracker API

A RESTful API for tracking daily habits, where users can sign up, sign in, create habits, and record their progress. This project is built with Node.js, Express, and MongoDB (Mongoose), and is designed to provide a backend service for habit tracking applications.

## Features
- **User Authentication:** Users can sign up and log in to access their habits.
- **Create Habits:** Users can create and manage their habits.
- **Track Daily Records:** Each habit can have daily progress updates.
- **CRUD Operations:** Full functionality for creating, reading, updating, and deleting habits and records.

## Technologies
- **[Node.js](https://nodejs.org/)**: JavaScript runtime environment for executing server-side code.
- **[Express.js](https://expressjs.com/)**: Fast, minimalist web framework for Node.js, used to create API routes and handle HTTP requests.
- **[MongoDB](https://www.mongodb.com/)**: A NoSQL database, used for storing user accounts, habits, and records.
- **[Mongoose](https://www.npmjs.com/package/mongoose)**: An Object Data Modeling (ODM) library for MongoDB, providing schema validation and a flexible interface for querying MongoDB.
- **[JWT (JSON Web Token)](https://www.npmjs.com/package/jsonwebtoken)**: Used for securely transmitting information between the client and server for authentication.
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)**: A password hashing library used to securely store user passwords.
- **[dotenv](https://www.npmjs.com/package/dotenv)**: Environment variable management, used for configuring secrets and database URIs.
- **[body-parser](https://www.npmjs.com/package/body-parser)**: Middleware to parse incoming request bodies in a middleware, supporting `json` and `urlencoded` formats.
- **[case](https://www.npmjs.com/package/case)**: A utility for converting strings between different cases (e.g., camelCase, snake_case).
- **[cors](https://www.npmjs.com/package/cors)**: Middleware to enable Cross-Origin Resource Sharing (CORS) in Express.js applications.
- **[Joi](https://www.npmjs.com/package/joi)**: Schema description language and data validator for JavaScript.
- **[moment](https://www.npmjs.com/package/moment)**: A library for parsing, validating, manipulating, and formatting dates.
- **[validator](https://www.npmjs.com/package/validator)**: A library of string validators and sanitizers.
- **[Nodemon](https://www.npmjs.com/package/nodemon)**: A development tool that automatically restarts the Node.js server when file changes are detected.

## API Endpoints

### Authentication
- **POST /api/v1/register** - Create a new user account.
- **POST /api/v1/login** - Authenticate and sign in a user.

### Habits
- **POST /api/v1/habit** - Create a new habit.
- **GET /api/v1/habit** - Get all habits for the logged-in user.
- **GET /api/v1/habit/{habit_id}** - Get a specific habit by its ID (Including records).
- **PATCH /api/v1/habit/{habit_id}** - Update an existing habit.
- **DELETE /api/v1/habit/{habit_id}** - Delete a habit.

### Habit Entries (Records)
- **POST /api/v1/habit/entry** - Add a record for a habit.
- **PATCH /api/v1/habit/entry/{entry_id}** - Update an existing record.
- **DELETE /api/v1/habit/entry/{entry_id}** - Delete a record.

### User Profile
- **PATCH /api/v1/profile** - Update profile for logged-in user.
- **GET /api/v1/profile** - get profile for logged-in user.

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/kunalkhanx/habit-tracker-api.git
    cd habit-tracker-api
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Setp `.env` file & variables
    1. Rename `.env.example` to `.env`
    2. Add mongodb connection path to `DB_PATH` variable
    3. Create a new secret key to `APP_KEY` variable
4. Start the server
    ```bash
    npm start
    ```
5. Access the API at http://localhost:8080

## Usage
- Use tools like Postman or curl to interact with the API.
- Sign up with a POST request to /api/register to create an account.
- Log in with a POST request to /api/login to retrieve a token for authentication.
- Include the token as Beader Token in the Authorization header for requests to create and manage habits.

## Database Schema
### User
```json
{
    "first_name": "String",
    "last_name": "String|Null",
    "email": "String",
    "password": "String",
    "dob": "Date|String",
    "sex": "Srting"
}
```
### Habit
```json
{
    "name": "String",
    "description": "String",
    "user": "String", // Mongoose Object Id
    "has_target": "Boolean",
    "target_unit": "String",
    "target":"String|Number",
    "frequency":"String" // Daily, Weekly, Monthly, Yearly

}
```
### Habit Entry
```json
{
    "habit": "String", // Mongoose Object Id
    "user": "String", // Mongoose Object Id
    "entry_on": "DateTime",
    "entry_value": "String",
    "note": "String|Null"
}
```

## License
This project is licensed under the MIT License.