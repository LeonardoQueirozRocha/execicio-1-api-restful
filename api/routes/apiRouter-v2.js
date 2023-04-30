const express = require('express');
const apiRouterV2 = express.Router();
const endpoint = '/';
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3'
    }
});

const getNextId = () => data.products.reduce((arr, oId) => (arr = arr > oId.id ? arr : oId.id), 0) + 1
const payloadValidate = (body) => body.description === undefined || body.price === undefined || body.brand === undefined;
const getProductById = (searched_id) => data.products.find(({ id }) => id === +searched_id);
const productExists = (description) => data.products.map(product => product.description).includes(description);

apiRouterV2.get(endpoint + 'products', function (req, res) {
    knex.select('*').from('products')
        .then(products => res.status(200).json(products))
        .catch(err => res.status(400).json({ message: `Erro ao obter os produtos: ${err.message}` }))
});

apiRouterV2.get(endpoint + 'products/:id', function (req, res) {
    // const product = getProductById(req.params.id);

    // if (product === undefined || product === null) {
    //     res.status(404).json({ message: 'Produto não encontrado' });
    //     return;
    // }

    // res.status(200).json(product);
});

apiRouterV2.post(endpoint + 'products', function (req, res) {
    knex('products').insert(req.body, ['id'])
        .then(products => {
            let id = products[0].id;
            res.status(201).json({ message: 'Produto inserido com sucesso.', id });
        })
        .catch(err => res.status(400).json({ message: `Erro ao inserir produto: ${err.message}` }))


    // if (payloadValidate(req.body)) {
    //     res.status(400).json({ message: 'Payload inválido' });
    //     return;
    // }

    // if (productExists(req.body.description)) {
    //     res.status(400).json({ message: `O produto ${req.body.description} já está cadastrado` });
    //     return;
    // }

    // const product = {
    //     id: getNextId(),
    //     description: req.body.description,
    //     price: req.body.price,
    //     brand: req.body.brand
    // };

    // data.products.push(product);

    // res.status(201).json(product);
});

apiRouterV2.put(endpoint + 'products/:id', function (req, res) {
    // if (payloadValidate(req.body)) {
    //     res.status(400).json({ message: 'Payload inválido' });
    //     return;
    // }

    // const product = getProductById(req.params.id);

    // if (product === undefined || product === null) {
    //     res.status(404).json({ message: 'Produto não encontrado' });
    //     return;
    // }

    // product.description = req.body.description;
    // product.price = req.body.price;
    // product.brand = req.body.brand;

    // const index = data.products.findIndex(({ id }) => id === +req.params.id);

    // data.products[index] = product;

    // res.status(200).json(data.products[index]);
});

apiRouterV2.delete(endpoint + 'products/:id', function (req, res) {
    // const product = getProductById(req.params.id);

    // if (product === undefined || product === null) {
    //     res.status(404).json({ message: 'Produto não encontrado' });
    //     return;
    // }

    // var index = data.products.findIndex(({ id }) => id === +req.params.id);

    // data.products.splice(index, 1);

    // res.status(200).json(product);
});

module.exports = apiRouterV2;