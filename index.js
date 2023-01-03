const mysql = require('mysql');  // mysql 모듈 로드
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

const hostname = '127.0.0.1';
const port = 3000;

const conn = {  // mysql 접속 설정
    host: 'svc.gksl2.cloudtype.app',
    port: '32059',
    user: 'root',
    password: '1032',
    database: 'color_memo',
    multipleStatements : true
};

let connection = mysql.createConnection(conn); // DB 커넥션 생성
connection.connect();   // DB 접속

let sql = "SELECT EMAIL, USERNAME FROM `MEMBER`";
let sql_data;
connection.query(sql, function (err, results) {
    if (err) {
        console.log(err);
    }
    sql_data = {
        "results": results
    }
});

/* 전체 통계 */
let sql_lo = "SELECT ROUND, NUM1, NUM2, NUM3, NUM4, NUM5, NUM6, NUMB, PRIZE1, PRIZE1CNT, PRIZE2, PRIZE2CNT, DATE_FORMAT(ROUND_DATE,'%Y년 %m월 %d일') AS ROUND_DATE, FORMAT(PRIZE1, 0) AS PRIZE1_, FORMAT(PRIZE2, 0) AS PRIZE2_ FROM `LOTTO` ORDER BY ROUND DESC; ";
/* 번호별 횟수 */
let sql_lo_num_cnt = "SELECT NUM, SUM(NUM_CNT) AS NUM_CNT FROM V_LOTTO_CNT GROUP BY NUM ORDER BY NUM_CNT DESC; ";


/* 최근 10회차 번호별 횟수 */
let sql_lo_recently10_num_cnt = "SELECT TEMP.NUM AS NUM, SUM(TEMP.NUM_CNT) AS NUM_CNT FROM (" +
  "SELECT NUM1 AS NUM, COUNT(NUM1) AS NUM_CNT FROM `V_RECENTLY10_LOTTO` GROUP BY NUM UNION ALL " +
  "SELECT NUM2 AS NUM, COUNT(NUM2) AS NUM_CNT FROM `V_RECENTLY10_LOTTO` GROUP BY NUM UNION ALL " +
  "SELECT NUM3 AS NUM, COUNT(NUM3) AS NUM_CNT FROM `V_RECENTLY10_LOTTO` GROUP BY NUM UNION ALL " +
  "SELECT NUM4 AS NUM, COUNT(NUM4) AS NUM_CNT FROM `V_RECENTLY10_LOTTO` GROUP BY NUM UNION ALL " +
  "SELECT NUM5 AS NUM, COUNT(NUM5) AS NUM_CNT FROM `V_RECENTLY10_LOTTO` GROUP BY NUM UNION ALL " +
  "SELECT NUM6 AS NUM, COUNT(NUM6) AS NUM_CNT FROM `V_RECENTLY10_LOTTO` GROUP BY NUM UNION ALL " +
  "SELECT NUMB AS NUM, COUNT(NUMB) AS NUM_CNT FROM `V_RECENTLY10_LOTTO` GROUP BY NUM) TEMP GROUP BY NUM ORDER BY NUM_CNT DESC; "; 
let sql_data_lo;
  connection.query(sql_lo + sql_lo_num_cnt + sql_lo_recently10_num_cnt, function (err, results) {
    if (err) {
        console.log(err);
    }
    sql_data_lo = {
      "results_lo" : results[0],
      "results_lo_num_cnt" : results[1],
      "results_lo_recently10_num_cnt" : results[2]
    }
});

//app.set('view engine', 'pug');
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static("views"));

app.get('/', (req, res) => {
  res.render('index', sql_data);
})

app.get('/lotto', (req, res) => {
  res.render('lotto', sql_data_lo);
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

connection.end(); // DB 접속 종료


