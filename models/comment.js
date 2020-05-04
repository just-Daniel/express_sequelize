const Comment = sequelize.define('comment', {
  description: {
    type: Sequelize.STRING,
  },
  article_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'articles',
      key: 'id',
    },
    onDelete: 'cascade',
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

module.exports = Comment;
