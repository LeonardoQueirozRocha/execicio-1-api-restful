const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3'
    }
});

getById = (userId) => knex.select('*').from('users').where('id', userId);

getByLogin = (userLogin) => knex.select('*').from('users').where('login', userLogin);

insert = (user) => knex('users').insert({
    name: user.name,
    login: user.login,
    password: bcrypt.hashSync(user.password, 8),
    email: user.email,
    roles: "USER"
}, ['id']);

checkPassword = (requestedPassword, basePassword) => bcrypt.compareSync(requestedPassword, basePassword);

generateToken = (userId) => jwt.sign({ id: userId },
    process.env.SECRET_KEY, {
    expiresIn: 3600
});

testToken = (bearer) => /Bearer/.test(bearer);

getDecodedToken = (token) => jwt.verify(token, process.env.SECRET_KEY);

isAdmin = (user) => user.roles.split(';').includes('ADMIN');

module.exports = {
    getById,
    getByLogin,
    insert,
    checkPassword,
    generateToken,
    testToken,
    getDecodedToken,
    isAdmin
}