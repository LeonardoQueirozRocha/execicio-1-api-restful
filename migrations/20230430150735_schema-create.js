/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("products", tbl => {
        tbl.increments('id');
        tbl.text("description", 255)
            .unique()
            .notNullable();
        tbl.decimal("price").notNullable();
        tbl.text("brand", 128).notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("products");
};
