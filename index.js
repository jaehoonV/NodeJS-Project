const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
const server = http.createServer(app);
const hostname = '127.0.0.1';
const port = 3000;

// mariaDB Connection
//const maria = require('./ext/conn_mariaDB');
//maria.connect();   // DB 접속

let indexRouter  = require('./routes/index');
let lottoRouter = require('./routes/lotto');
let minesweeperRouter = require('./routes/minesweeper');
let daily2048Router = require('./routes/2048_daily');
let myWorkListRouter = require('./routes/myWorkList');

//app.set('view engine', 'pug');
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));
app.use(express.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static("views"));
app.use(express.static("public"));

app.use('/', indexRouter);
app.use('/lotto', lottoRouter);
app.use('/minesweeper', minesweeperRouter);
app.use('/2048_daily', daily2048Router);
app.use('/my_work_list', myWorkListRouter);

// 404 Error Handling
app.all('*',(req, res, next) => {
  res.status(404).render('error',{error: 404});
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports = app;

// connection.end(); // DB 접속 종료

