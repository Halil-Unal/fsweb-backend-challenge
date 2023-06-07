exports.up = function (knex) {
  return knex.schema
    .createTable('users', users => {
      users.increments('user_id')
      users.string('username', 128).notNullable().unique()
      users.string('password', 128).notNullable()
      users.string('email', 128).notNullable().unique()
    })
    .createTable('comments', comments => {
      comments.increments('comment_id')
      comments.string('comment_text', 32).unique()
      comments
        .integer('user_id')
        .unsigned()
        .references('user_id')
        .inTable('users')
        .onUpdate('CASCADE') 
        .onDelete('CASCADE') 
        .notNullable()
    });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('comments').dropTableIfExists('users');
};
