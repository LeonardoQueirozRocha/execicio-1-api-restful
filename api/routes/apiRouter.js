const express = require('express');
const apiRouter = express.Router();
const endpoint = '/';
const data = {
    products: [
        { id: 1, description: "Arroz parboilizado 5Kg", price: 25.00, brand: "Tio João" },
        { id: 2, description: "Maionese 250gr", price: 7.20, brand: "Helmans" },
        { id: 3, description: "Iogurte Natural 200ml", price: 2.50, brand: "Itambé" },
        { id: 4, description: "Batata Maior Palha 300gr", price: 15.20, brand: "Chipps" },
        { id: 5, description: "Nescau 400gr", price: 8.00, brand: "Nestlé" },
    ]
};

const getNextId = () => data.products.reduce((arr, oId) => (arr = arr > oId.id ? arr : oId.id), 0) + 1
const payloadValidate = (body) => body.description === undefined || body.price === undefined || body.brand === undefined;
const getProductById = (searched_id) => data.products.find(({ id }) => id === +searched_id);
const productExists = (description) => data.products.map(product => product.description).includes(description);

apiRouter.get(endpoint + 'products', function (req, res) {
    res.status(200).json(data);
});

apiRouter.get(endpoint + 'products/:id', function (req, res) {
    const product = getProductById(req.params.id);

    if (product === undefined || product === null) {
        res.status(404).json({ message: 'Produto não encontrado' });
        return;
    }

    res.status(200).json(product);
});

apiRouter.post(endpoint + 'products', function (req, res) {
    if (payloadValidate(req.body)) {
        res.status(400).json({ message: 'Payload inválido' });
        return;
    }

    if (productExists(req.body.description)) {
        res.status(400).json({ message: `O produto ${req.body.description} já está cadastrado` });
        return;
    }

    const product = {
        id: getNextId(),
        description: req.body.description,
        price: req.body.price,
        brand: req.body.brand
    };

    data.products.push(product);

    res.status(201).json(product);
});

apiRouter.put(endpoint + 'products/:id', function (req, res) {
    if (payloadValidate(req.body)) {
        res.status(400).json({ message: 'Payload inválido' });
        return;
    }

    const product = getProductById(req.params.id);

    if (product === undefined || product === null) {
        res.status(404).json({ message: 'Produto não encontrado' });
        return;
    }

    product.description = req.body.description;
    product.price = req.body.price;
    product.brand = req.body.brand;

    const index = data.products.findIndex(({ id }) => id === +req.params.id);

    data.products[index] = product;

    res.status(200).json(data.products[index]);
});

apiRouter.delete(endpoint + 'products/:id', function (req, res) {
    const product = getProductById(req.params.id);

    if (product === undefined || product === null) {
        res.status(404).json({ message: 'Produto não encontrado' });
        return;
    }

    var index = data.products.findIndex(({ id }) => id === +req.params.id);

    data.products.splice(index, 1);

    res.status(200).json(product);
});

module.exports = apiRouter;