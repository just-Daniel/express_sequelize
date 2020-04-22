const ResponseError = require('../routes/auth/response-error');
const Article = require('../models/article');

// const updateArticles = (id, title, body, decodedId) =>{
//   const promise = new Promise((resolve, reject) => {
//     db.query('SELECT * FROM articles WHERE id = ?', [id], (err, rows, fields) =>{
//       if (err) {
//         reject(new ResponseError(err, 400));
//       } else {
//         if (rows[0].user_id === decodedId) {
//           db.query(`UPDATE articles SET title= ?, body= ?, updated_date= ? WHERE id= ?`,
//               [title, body, new Date(), id], (err, rows, fields) => {
//                 if (err) {
//                   reject(new ResponseError('Unable to update article ' + err, 400));
//                 } else {
//                   if (rows.length === 0) {
//                     reject(new ResponseError(`Id: "${id}" not found ` + err, 400));
//                   } else {
//                     resolve({status: 'OK'});
//                   }
//                 }
//               });
//         } else {
//           reject(new ResponseError(
//               `User doesn't have permissions to edit this articles! ` + err, 400));
//         }
//       }
//     });
//   });
//   return promise;
// };


const updateArticles = (id, title, body, decodedId) =>{
  const promise = new Promise((resolve, reject) => {
     Article.findByPk(id)
      .then((articles) => {
        if(articles[0].user_id === decodedId){  // maybe articles.user_id
          Article.update({ title: title, body: body,}, { where: { id: id }})
            .then((articles) => {
              if (articles.length === 0) {
                reject(new ResponseError(`Id: "${id}" not found ` + err, 400));
              } else {
                resolve({status: 'OK'});
              }
            })
            .catch(err => reject(new ResponseError('Unable to update article ' + err, 400)))
        } else {
          reject(new ResponseError(
            `User doesn't have permissions to edit this articles! ` + err, 400));
        }
      })
      .catch(err => reject(new ResponseError(err, 400)));
  });
  return promise;
};


// const insertArticles = (title, body, decodedId) =>{
//   const promise = new Promise((resolve, reject) => {
//     db.query(`INSERT INTO articles VALUES(?, ?, ?, ?, ?, ?)`,
//         [null, title, body, new Date(), new Date, decodedId],
//         (err, rows, fields) => {
//           if (err) {
//             console.log('CHECK: ' + title, body, decodedId);
//             reject(new ResponseError(err, 400));
//           } else {
//             resolve({status: 'OK'});
//           }
//         });
//   });
//   return promise;
// };

const insertArticles = (title, body, decodedId) =>{
  const promise = new Promise((resolve, reject) => {
    Article.create({
      title: title,
      body: body,
      user_id: decodedId,
    }).then(function(article){
      console.log('CHECK: ', article);
      if (article) {
        resolve({status: 'OK'});
      } else {
        reject(new ResponseError('err', 400));
      }
    });
  });
  return promise;
};


// const deleteArticles = (id, decodedId) => {
//   const promise = new Promise((resolve, reject) => {
//     db.query('SELECT * FROM articles WHERE id = ?',
//         [id], (err, rows, fields) => {
//           if (err) {
//             reject(new ResponseError(err, 400));
//           } else {
//             if (rows[0].user_id === decodedId) {
//               db.query(`DELETE FROM articles WHERE id = ?`,
//                   [id], (err, rows, fields) => {
//                     if (err) {
//                       reject(new ResponseError('Unable to delete article ' + err, 400));
//                     } else {
//                       resolve({status: 'OK'});
//                     }
//                   });
//             } else {
//               reject(new ResponseError(
//                   `User doesn't have permissions to delete this articles! ` + err, 400));
//             }
//           }
//         });
//   });
//   return promise;
// };


const deleteArticles = (id, decodedId) => {
  const promise = new Promise((resolve, reject) => {
    
  Article.findAll({ where: { id: id }})
    .then((articles) => {
      if (articles[0].user_id === decodedId) {

        Article.destroy({ where: { id: id } })
          .then(() => resolve({status: 'OK'}))
          .catch(err => 
            reject(new ResponseError('Unable to delete article ' + err, 400))
            )
      } else {
        reject(new ResponseError(
          `User doesn't have permissions to delete this articles! ` + err, 400));
      }
    })
    .catch(err => reject(new ResponseError(err, 400)));
  });
  return promise;
};


// const getAllArticles = () => {
//   const promise = new Promise((resolve, reject) => {
//     db.query('SELECT * FROM articles', [], (err, rows, fields) => {
//       if (err) {
//         reject(new ResponseError(err, 400));
//       } else {
//         resolve(rows);
//       }
//     });
//   });
//   return promise;
// };

const getAllArticles = () => {
  const promise = new Promise((resolve, reject) => {
    Article.findAll()
      .then(articles => resolve(articles))
      .catch(err => reject(new ResponseError(err, 400)))
  });
  return promise;
};

module.exports.updateArticles = updateArticles;
module.exports.insertArticles = insertArticles;
module.exports.deleteArticles = deleteArticles;
module.exports.getAllArticles = getAllArticles;
