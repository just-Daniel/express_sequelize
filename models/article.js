const Article = sequelize.define('article', {
  title: {
    type: Sequelize.STRING,
  },
  body: {
    type: Sequelize.STRING,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    // primaryKey: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
});
module.exports = Article;
