const Comment = sequelize.define('comment', {
    description: { 
        type: Sequelize.STRING 
    },
    article_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // primaryKey: true,
        references: {
            model: 'articles',
            key: 'id'
        }
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // primaryKey: true,
        references: {
            model: 'users',
            key: 'id'
        }
    }
});

module.exports = Comment;
