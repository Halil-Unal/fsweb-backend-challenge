exports.seed = async function (knex) {
  await knex('comments').truncate();
  await knex('users').truncate();

  // Comments tablosuna veri ekleme


  // Users tablosuna veri ekleme
  await knex('users').insert([
    {
      username: 'Ali',
      password: '$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq', 
      email: 'ali@gmail.com',
     
    },
    {
      username: 'Zeynep',
      password: '$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq', 
      email: 'zeynep@gmail.com',
     
    }
  ]);
  await knex('comments').insert([
    {
      user_id: 1,
      comment_text: 'Hava Çok Güzel'
    },
    {
      user_id: 2,
      comment_text: 'Hatalarından Ders Çıkar'
    }
  ]);
};
