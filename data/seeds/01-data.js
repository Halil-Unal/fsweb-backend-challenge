exports.seed = async function (knex) {
  await knex('comments').truncate();
  await knex('users').truncate();

  // Comments tablosuna veri ekleme


  // Users tablosuna veri ekleme
  await knex('users').insert([
    {
      username: 'ali',
      password: '$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq', // password "1234"
      email: 'ali@gmail.com',
     
    },
    {
      username: 'zeynep',
      password: '$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq', // password "1234"
      email: 'zeynep@gmail.com',
     
    }
  ]);
  await knex('comments').insert([
    {
      user_id: 1,
      comment_text: 'hava çok güzel'
    },
    {
      user_id: 2,
      comment_text: 'hatalarından ders çıkar'
    }
  ]);
};
