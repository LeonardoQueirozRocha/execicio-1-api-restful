const express = require('express');
const ProductService = require('../../src/app/services/ProductService');
const apiRouterV2 = express.Router();
const endpoint = '/';

apiRouterV2.get(endpoint + 'products', function (req, res) {
    ProductService.getAll()
        .then(products => res.status(200).json(products))
        .catch(err => res.status(500).json({ message: 'Erro ao obter os produtos', error: err.message }));
});

apiRouterV2.get(endpoint + 'products/:id', function (req, res) {
    ProductService.getById(req.params.id)
        .then(product => {
            if (!product.length)
                return res.status(404).json({ message: 'Produto não encontrado' })

            res.status(200).json(product)
        })
        .catch(err => res.status(500).json({ message: 'Erro ao obter o produto', error: err.message }))
});

apiRouterV2.post(endpoint + 'products', function (req, res) {
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

apiRouterV2.put(endpoint + 'products/:id', function (req, res) {
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

apiRouterV2.delete(endpoint + 'products/:id', function (req, res) {
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

module.exports = apiRouterV2;