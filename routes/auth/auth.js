const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('./token-config.js');
const tokenUtils = require('./token-utils');
const User = require('../../models/user');

app.use('*', function(request, response, next) {
  if (request.baseUrl === '/login' || request.baseUrl == '/register' ) {
    next();
  } else {
    tokenUtils.getTokenUser(request)
        .then((user) => next())
        .catch((error) => response.status(error.status).send(error.message));
  }
});

app.get('/auth', (request, response, next) => {
  User.findAll().then(function(user) {
    if (user) {
      response.send(user);
    } else {
      response.status(400).send(err);
    }
  });
});

app.post('/register', function(req, response) {
  const data = req.query;
  const hashedPassword = crypto.createHash('md5').update(data.password).digest('hex');

  User.create({
    name: data.name,
    password: hashedPassword,
  }).then(function(user){
    if (user) {
      const token = jwt.sign({id: user.id, password: hashedPassword}, config.secret, {
        expiresIn: 86400, // expires in 24 hours
      });
      response.send({auth: true, token: token});
    } else {
      response.status(400).send({error: 'Unable to save new user'});
    }
  });
});



app.post('/login', function(req, response) {
  const data = req.query;
  const hashedPassword = crypto.createHash('md5').update(data.password).digest('hex');

  User.findOne({
    where: {
      name: data.name,
      password: hashedPassword
    }
  }).then(function(user){
    if (user) {
      const token = jwt.sign({id: user.id, password: hashedPassword}, // I use user.id instead user[0].id
        config.secret, {
          expiresIn: 86400, // expires in 24 hours
        });
        console.log('CHECK: ', token)
      response.send({auth: true, token: token});
        if (user.length === 0) {
          response.status(400).send({error: 'Username or password is incorrect'});
        };
    } else {
      response.status(400).send(err);
    }
  })
});
