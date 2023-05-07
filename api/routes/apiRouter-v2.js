const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const apiRouterV2 = express.Router();
const endpoint = '/';
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3'
    }
});

const checkToken = (req, res, next) => {
    let authInfo = req.get('authorization');
    if (authInfo) {
        const [bearer, token] = authInfo.split(' ');

        if (!/Bearer/.test(bearer)) {
            res.status(400).json({ message: 'Tipo de token esperado náo informado', error: true });
            return;
        }

        jwt.verify(token, process.env.SECRET_KEY, (err, decodeToken) => {
            if (err) {
                res.status(401).json({ message: "Acesso negado" });
                return;
            }

            req.userId = decodeToken.id;
            req.roles = decodeToken.roles;
            next();
        })
    }
    else {
        res.status(401).json({ message: "Acesso negado" });
    }
}

let isAdmin = (req, res, next) => {
    knex
        .select('*').from('users').where({ id: req.userId })
        .then((users) => {
            if (users.length) {
                let user = users[0]
                let roles = user.roles.split(';')
                let adminRole = roles.find(i => i === 'ADMIN')
                if (adminRole === 'ADMIN') {
                    next()
                    return
                }
                else {
                    res.status(403).json({ message: 'Role de ADMIN requerida' })
                    return
                }
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao verificar roles de usuário - ' + err.message
            })
        })
}

apiRouterV2.get(endpoint + 'products', checkToken, function (req, res) {
    knex.select('*').from('products')
        .then(products => res.status(200).json(products))
        .catch(err => res.status(400).json({ message: `Erro ao obter os produtos: ${err.message}` }))
});

apiRouterV2.get(endpoint + 'products/:id', checkToken, function (req, res) {
    knex.select('*').from('products')
        .where('id', req.params.id)
        .then(product => {
            if (product[0] === undefined) {
                res.status(404).json({ message: 'Produto não encontrado' })
                return;
            }

            res.status(200).json(product)
        })
        .catch(err => res.status(400).json({ message: `Erro ao obter o produtos: ${err.message}` }))
});

apiRouterV2.post(endpoint + 'products', checkToken, isAdmin, function (req, res) {
    knex('products').insert(req.body, ['id'])
        .then(products => res.status(201).json({ message: `Produto ${products[0].id} inserido com sucesso.` }))
        .catch(err => res.status(400).json({ message: `Erro ao inserir produto: ${err.message}` }));
});

apiRouterV2.put(endpoint + 'products/:id', checkToken, isAdmin, function (req, res) {
    knex('products')
        .where('id', req.params.id)
        .update({
            description: req.body.description,
            price: req.body.price,
            brand: req.body.brand
        }, ['id'])
        .then(product => {
            if (product[0] === undefined) {
                res.status(404).json({ message: 'Produto não encontrado' })
                return;
            }

            res.status(200).json({ message: `Produto ${product[0].id} atualizado com sucesso` })
        })
        .catch(err => res.status(400).json({ message: `Erro ao atualizar produto: ${err.message}` }));
});

apiRouterV2.delete(endpoint + 'products/:id', checkToken, function (req, res) {
    knex.select('*').from('products')
        .where('id', req.params.id)
        .then(product => {
            if (product[0] === undefined) {
                res.status(404).json({ message: 'Produto não encontrado' })
                return;
            }

            knex('products').del()
                .where('id', req.params.id)
                .then(product => res.status(200).json({ message: `Produto ${req.params.id} deletado com sucesso` }))
        })
        .catch(err => res.status(400).json({ message: `Erro ao deletar produto: ${err.message}` }));
});

apiRouterV2.post(endpoint + 'auth/register', function (req, res) {
    knex('users').insert({
        name: req.body.name,
        login: req.body.login,
        password: bcrypt.hashSync(req.body.password, 8),
        email: req.body.email,
        roles: "USER"
    }, ['id'])
        .then((result) => {
            let user = result[0];
            res.status(200).json({ message: "Usuário inserido com sucesso", id: user.id });
            return;
        })
        .catch(err => {
            res.status(500).json({ message: "Erro ao registar o usuário - " + err.message });
        })
});

apiRouterV2.post(endpoint + 'auth/login', function (req, res) {
    knex.select('*').from('users').where({ login: req.body.login })
        .then(users => {
            if (users.length) {
                let user = users[0];
                let checkPassword = bcrypt.compareSync(req.body.password, user.password);

                if (checkPassword) {
                    var tokenJWT = jwt.sign({ id: user.id },
                        process.env.SECRET_KEY, {
                        expiresIn: 3600
                    });

                    res.status(200).json({
                        id: user.id,
                        login: user.login,
                        name: user.name,
                        roles: user.roles,
                        token: tokenJWT
                    });

                    return;
                }
            }

            res.status(401).json({ message: 'Login ou senha incorretos' });
        })
});

module.exports = apiRouterV2;