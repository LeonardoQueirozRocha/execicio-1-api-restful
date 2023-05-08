const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3'
    }
});

getAll = () => knex.select('*').from('products');

getById = (productId) => knex.select('*').from('products').where('id', productId);

getByDescription = (productDescription) => knex.select('*').from('products').where('description', productDescription);

insert = (product) => knex('products').insert(product, ['id']);

update = (productId, product) => knex('products').where('id', productId).update({
    description: product.description,
    price: product.price,
    brand: product.brand
}, ['id']);

remove = (productId) => knex('products').del().where('id', productId)

module.exports = {
    getAll,
    getById,
    getByDescription,
    insert,
    update,
    remove
}