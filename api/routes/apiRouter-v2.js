const express = require('express');
const ProductService = require('../../src/app/services/ProductService');
const UserService = require('../../src/app/services/UserService');
const apiRouterV2 = express.Router();
const endpoint = '/';

const checkToken = (req, res, next) => {
    let authInfo = req.get('authorization');
    if (!authInfo)
        return res.status(401).json({ message: "Acesso negado" });

    const [bearer, token] = authInfo.split(' ');
    if (!testToken(bearer))
        return res.status(400).json({ message: 'Tipo de token esperado náo informado', error: true });

    let decodedToken = UserService.getDecodedToken(token);

    if (!decodedToken)
        return res.status(401).json({ message: "Acesso negado" });

    req.userId = decodedToken.id;
    req.roles = decodedToken.roles;
    next();
}

const isAdmin = (req, res, next) => {
    UserService.getById(req.userId)
        .then((users) => {
            if (!users.length) return;

            if (!UserService.isAdmin(users[0]))
                return res.status(403).json({ message: 'Role ADMIN requerida' })

            next();
        })
        .catch(err => res.status(500).json({ message: 'Erro ao verificar as roles do usuário', error: err.message }))
}

apiRouterV2.get(endpoint + 'products', checkToken, function (req, res) {
    ProductService.getAll()
        .then(products => res.status(200).json(products))
        .catch(err => res.status(500).json({ message: 'Erro ao obter os produtos', error: err.message }));
});

apiRouterV2.get(endpoint + 'products/:id', checkToken, function (req, res) {
    ProductService.getById(req.params.id)
        .then(product => {
            if (!product.length)
                return res.status(404).json({ message: 'Produto não encontrado' })

            res.status(200).json(product)
        })
        .catch(err => res.status(500).json({ message: 'Erro ao obter o produto', error: err.message }))
});

apiRouterV2.post(endpoint + 'products', checkToken, isAdmin, function (req, res) {
    ProductService.getByDescription(req.body.description)
        .then(product => {
            if (product.length)
                return res.status(400).json({ message: 'Produto já cadastro' })

            ProductService.insert(req.body)
                .then(products => res.status(201).json({ message: `Produto ${products[0].id} inserido com sucesso.` }))
                .catch(err => res.status(500).json({ message: 'Erro ao inserir o produto', error: err.message }))
        })
        .catch(err => res.status(500).json({ message: 'Erro ao inserir o produto', error: err.message }))
});

apiRouterV2.put(endpoint + 'products/:id', checkToken, isAdmin, function (req, res) {
    ProductService.getByDescription(req.body.description)
        .then(product => {
            if (product.length)
                return res.status(400).json({ message: 'Produto já cadastro' })

            ProductService.update(req.params.id, req.body)
                .then(product => {
                    if (!product.length)
                        return res.status(404).json({ message: 'Produto não encontrado' })

                    res.status(200).json({ message: `Produto ${product[0].id} atualizado com sucesso` })
                })
                .catch(err => res.status(500).json({ message: 'Erro ao atualizar o produto', error: err.message }))
        })
        .catch(err => res.status(500).json({ message: 'Erro ao atualizar o produto', error: err.message }));
});

apiRouterV2.delete(endpoint + 'products/:id', checkToken, isAdmin, function (req, res) {
    ProductService.getById(req.params.id)
        .then(product => {
            if (!product.length)
                return res.status(404).json({ message: 'Produto não encontrado' })

            ProductService.remove(req.params.id)
                .then(product => res.status(200).json({ message: `Produto ${req.params.id} deletado com sucesso` }))
                .catch(err => res.status(500).json({ message: 'Erro ao deletar o produto', error: err.message }))
        })
        .catch(err => res.status(500).json({ message: 'Erro ao deletar o produto', error: err.message }))
});

apiRouterV2.post(endpoint + 'auth/register', function (req, res) {
    UserService.getByLogin(req.body.login)
        .then(user => {
            if (user.length)
                return res.status(400).json({ message: 'Usuário já cadastro' })

            UserService.insert(req.body)
                .then((result) => {
                    let user = result[0];
                    res.status(200).json({ message: "Usuário inserido com sucesso", id: user.id });
                })
                .catch(err => res.status(500).json({ message: "Erro ao cadastrar o usuário - ", error: err.message }))
        })
        .catch(err => res.status(500).json({ message: "Erro ao cadastrar o usuário - ", error: err.message }));
});

apiRouterV2.post(endpoint + 'auth/login', function (req, res) {
    UserService.getByLogin(req.body.login)
        .then(users => {
            if (!users.length)
                return res.status(401).json({ message: 'Login ou senha incorretos' });

            let user = users[0];

            if (!UserService.checkPassword(req.body.password, user.password))
                return res.status(401).json({ message: 'Login ou senha incorretos' });

            res.status(200).json({
                id: user.id,
                login: user.login,
                name: user.name,
                roles: user.roles,
                token: UserService.generateToken(user.id)
            });
        })
});

module.exports = apiRouterV2;