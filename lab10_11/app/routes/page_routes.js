var ObjectID = require('mongodb').ObjectID;
var _dirname = 'C:/Users/dovha/Desktop/Web/lab10_11';
module.exports = function(app, db) {
  app.get('/', (req, res) => {
    res.sendFile(_dirname + '/index.html');
  });
  app.get('/index.html', (req, res) => {
    res.sendFile(_dirname + '/index.html');
  });
  app.get('/pages/admin.html', (req, res) => {
    res.sendFile(_dirname + '/pages/admin.html');
  });
  app.get('/pages/contacts.html', (req, res) => {
    res.sendFile(_dirname + '/pages/contacts.html');
  });
  app.get('/pages/fans.html', (req, res) => {
    res.sendFile(_dirname + '/pages/fans.html');
  });
  app.get('/pages/news.html', (req, res) => {
    res.sendFile(_dirname + '/pages/news.html');
  });
  app.get('/pages/matches.html', (req, res) => {
    res.sendFile(_dirname + '/pages/matches.html');
  });
};
