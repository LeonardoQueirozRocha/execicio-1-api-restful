const express = require('express');
const apiRouterV2 = express.Router();
const endpoint = '/';
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3'
    }
});

apiRouterV2.get(endpoint + 'products', function (req, res) {
    knex.select('*').from('products')
        .then(products => res.status(200).json(products))
        .catch(err => res.status(400).json({ message: `Erro ao obter os produtos: ${err.message}` }))
});

apiRouterV2.get(endpoint + 'products/:id', function (req, res) {
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

apiRouterV2.post(endpoint + 'products', function (req, res) {
    knex('products').insert(req.body, ['id'])
        .then(products => res.status(201).json({ message: `Produto ${products[0].id} inserido com sucesso.` }))
        .catch(err => res.status(400).json({ message: `Erro ao inserir produto: ${err.message}` }));
});

apiRouterV2.put(endpoint + 'products/:id', function (req, res) {
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

apiRouterV2.delete(endpoint + 'products/:id', function (req, res) {
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

module.exports = apiRouterV2;