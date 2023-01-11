const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
const server = http.createServer(app);
const hostname = '127.0.0.1';
const port = 3000;

// mariaDB Connection
const maria = require('./ext/conn_mariaDB');
maria.connect();   // DB 접속

let sql = "SELECT EMAIL, USERNAME FROM `MEMBER`";
let sql_data;
maria.query(sql, function (err, results) {
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

/* 평균보다 많이 나온 번호 */
let sql_lo_avg_up = "SELECT * FROM V_LOTTO_CNT_SUM WHERE NUM_CNT >= GET_AVG_LOTTO_CNT() ORDER BY NUM_CNT DESC, NUM ASC; ";

/* 평균보다 적게 나온 번호 */
let sql_lo_avg_down = "SELECT * FROM V_LOTTO_CNT_SUM WHERE NUM_CNT < GET_AVG_LOTTO_CNT() ORDER BY NUM_CNT DESC, NUM ASC; ";

/* 많이 나온 번호(25%) */
let sql_lo_avg_top = "SELECT * FROM V_LOTTO_CNT_SUM WHERE NUM_CNT >= GET_AVG_LOTTO_CNT_TOP() ORDER BY NUM_CNT DESC, NUM ASC; ";

/* 적게 나온 번호(25%) */
let sql_lo_avg_bottom = "SELECT * FROM V_LOTTO_CNT_SUM WHERE NUM_CNT <= GET_AVG_LOTTO_CNT_BOTTOM() ORDER BY NUM_CNT DESC, NUM ASC; ";

//app.set('view engine', 'pug');
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static("views"));

app.get('/', (req, res) => {
  res.render('index', sql_data);
})

app.get('/lotto', (req, res) => {
  let sql_data_lo;
  maria.query(sql_lo + sql_lo_num_cnt + sql_lo_recently10_num_cnt + sql_lo_avg_up + sql_lo_avg_down + sql_lo_avg_top + sql_lo_avg_bottom, function (err, results) {
    if (err) {
        console.log(err);
    }
    sql_data_lo = {
      "results_lo" : results[0],
      "results_lo_num_cnt" : results[1],
      "results_lo_recently10_num_cnt" : results[2],
      "results_lo_avg_up" : results[3],
      "results_lo_avg_down" : results[4],
      "results_lo_top25" : results[5],
      "results_lo_bottom25" : results[6]
    }
    res.render('lotto', sql_data_lo);
  });
})

app.post('/lotto', (req, res) => {
  let sql_data_lo;
  maria.query(sql_lo + sql_lo_num_cnt + sql_lo_recently10_num_cnt + sql_lo_avg_up + sql_lo_avg_down + sql_lo_avg_top + sql_lo_avg_bottom, function (err, results) {
    if (err) {
        console.log(err);
    }
    sql_data_lo = {
      "results_lo" : results[0],
      "results_lo_num_cnt" : results[1],
      "results_lo_recently10_num_cnt" : results[2],
      "results_lo_avg_up" : results[3],
      "results_lo_avg_down" : results[4],
      "results_lo_top25" : results[5],
      "results_lo_bottom25" : results[6]
    }
    console.log(req.body.today);
    res.json(sql_data_lo);
  });
})

app.post('/save', (req, res) => {
  console.log(req.body);
  let sql_lo_insert = "INSERT INTO LOTTO(ROUND,NUM1,NUM2,NUM3,NUM4,NUM5,NUM6,NUMB,PRIZE1,PRIZE1CNT,PRIZE2,PRIZE2CNT,ROUND_DATE,REGDAY,REGID) "
  + "VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_DATE(), ?); ";

  maria.query(sql_lo_insert,
              [req.body.round, req.body.num1, req.body.num2, req.body.num3, req.body.num4, req.body.num5, req.body.num6, req.body.numB, req.body.prize1, req.body.prize1cnt, req.body.prize2, req.body.prize2cnt, req.body.round_date, req.body.regid], 
              function (err, result) {
    if (err) {
      console.log(err);
    } else{
      console.log("1 record inserted!");
      let sql_data_lo;
      maria.query(sql_lo + sql_lo_num_cnt + sql_lo_recently10_num_cnt + sql_lo_avg_up + sql_lo_avg_down + sql_lo_avg_top + sql_lo_avg_bottom, function (err, results) {
        if (err) {
            console.log(err);
        }
        sql_data_lo = {
          "results_lo" : results[0],
          "results_lo_num_cnt" : results[1],
          "results_lo_recently10_num_cnt" : results[2],
          "results_lo_avg_up" : results[3],
          "results_lo_avg_down" : results[4],
          "results_lo_top25" : results[5],
          "results_lo_bottom25" : results[6]
        }
        res.render('lotto', sql_data_lo);
      });
    }
  });
})

app.post('/extraction', (req, res) => {

  let sql_lo_ext_sel = "SELECT A.ROUND, A.NUM1, A.NUM2, A.NUM3, A.NUM4, A.NUM5, A.NUM6, COUNT(A.ROUND) AS CNT FROM "
    + "(SELECT * FROM LOTTO WHERE NUM1 IN (" + req.body.num1 + ", " + req.body.num2 + ", " + req.body.num3 + ", " + req.body.num4 + ", " + req.body.num5 + ", " + req.body.num6 + ") "
    + "UNION ALL "
    + "SELECT * FROM LOTTO WHERE NUM2 IN (" + req.body.num1 + ", " + req.body.num2 + ", " + req.body.num3 + ", " + req.body.num4 + ", " + req.body.num5 + ", " + req.body.num6 + ") "
    + "UNION ALL "
    + "SELECT * FROM LOTTO WHERE NUM3 IN (" + req.body.num1 + ", " + req.body.num2 + ", " + req.body.num3 + ", " + req.body.num4 + ", " + req.body.num5 + ", " + req.body.num6 + ") "
    + "UNION ALL "
    + "SELECT * FROM LOTTO WHERE NUM4 IN (" + req.body.num1 + ", " + req.body.num2 + ", " + req.body.num3 + ", " + req.body.num4 + ", " + req.body.num5 + ", " + req.body.num6 + ") "
    + "UNION ALL "
    + "SELECT * FROM LOTTO WHERE NUM5 IN (" + req.body.num1 + ", " + req.body.num2 + ", " + req.body.num3 + ", " + req.body.num4 + ", " + req.body.num5 + ", " + req.body.num6 + ") "
    + "UNION ALL "
    + "SELECT * FROM LOTTO WHERE NUM6 IN (" + req.body.num1 + ", " + req.body.num2 + ", " + req.body.num3 + ", " + req.body.num4 + ", " + req.body.num5 + ", " + req.body.num6 + ")) A "
    + "GROUP BY A.ROUND, A.NUM1, A.NUM2, A.NUM3, A.NUM4, A.NUM5, A.NUM6 HAVING CNT > 3 ";
  
  maria.query(sql_lo_ext_sel, function (err, result) {
    if (err) {
      console.log(err);
    } else{
      res.json(result);
    }
  });
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// connection.end(); // DB 접속 종료


