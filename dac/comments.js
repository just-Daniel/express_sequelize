const ResponseError = require('../routes/auth/response-error');
const Comment = require('../models/comment');


const getAllComments = () => {
  const promise = new Promise((resolve, reject) => {
    Comment.findAll()
        .then((comments) => resolve(comments))
        .catch((err) => reject(new ResponseError(err, 400)));
  });
  return promise;
};


// const updateComments = (id, decodedId, description) => {
//   const promise = new Promise((resolve, reject) => {
//     Comment.findByPk(id)
//         .then((comments) => {
//           if (comments.user_id === decodedId) {
//             Comment.update({description: description}, {where: {id: id}})
//                 .then((comments) => {
//                   if (comments.length === 0) {
//                     reject(new ResponseError(`Id: "${id}" not found ` + err, 400));
//                   } else {
//                   resolve({status: 'OK'});
//                   }
//                 })
//                 .catch((err) => reject(new ResponseError(
//                     'Unable to update ' + err, 404)));
//           } else {
//             reject(new ResponseError(
//                 'User doesn\'t have permissions to update this comments! '+ err, 400));
//           }
//         })
//         .catch(reject(new ResponseError(err, 400)));
//   });
//   return promise;
// };


const updateComments = (id, decodedId, description) => {
  const promise = new Promise((resolve, reject) => {
    Comment.findByPk(id)
        .then((comment) => {
          if (comment) {
            if (comment.user_id === decodedId) {
              Comment.update({description: description}, {where: {id: id}})
                  // .then(() => resolve({status: 'OK'}))
                  .then((result) => {
                    console.log('ok', result);
                    resolve(result);
                  })
                  .catch((err) => reject(new ResponseError(
                      'Unable to update ' + err, 404)));
            } else {
              reject(new ResponseError(
                  'User doesn\'t have permissions to update this comments! ', 400));
            }
          } else {
            reject(new ResponseError(`Id: "${id}" not found `, 400));
          }
        })
        .catch(reject(new ResponseError(err, 400)));
  });
  return promise;
};


const insertComments = (description, article_id, decodedId) => {
  const promise = new Promise((resolve, reject) => {
    Comment.create({
      description: description,
      article_id: article_id,
      user_id: decodedId,
    }).then(() => resolve({status: 'OK'}))
        .catch((err) => reject(new ResponseError(
            'Unable to save new comment ' + err, 400)));
  });
  return promise;
};


const deleteComments = (id, decodedId) => {
  const promise = new Promise((resolve, reject) => {
    Comment.findByPk(id)
        .then((comments) => {
          if (comments.user_id === decodedId) {
            Comment.destroy({where: {id: id}})
                .then(() => resolve({status: 'OK'}))
                .catch((err) => reject(new ResponseError(
                    `Unable to deleted comment ` + err, 404)));
          } else {
            reject(new ResponseError(
                `User doesn't have permissions to delete this comments! ` + err, 400));
          }
        })
        .catch((err) => reject(new ResponseError(err, 400)));
  });
  return promise;
};


module.exports.getAllComments = getAllComments;
module.exports.updateComments = updateComments;
module.exports.insertComments = insertComments;
module.exports.deleteComments = deleteComments;
