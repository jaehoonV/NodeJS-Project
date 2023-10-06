var express = require('express');
var router = express.Router();

router.use(express.static("public"));

// mariaDB Connection
const maria = require('../ext/conn_mariaDB');

let sql = "SELECT EMAIL, USERNAME, MASTER_YN FROM `MEMBER`";
var sql_data;
maria.query(sql, function (err, results) {
  if (err) {
      console.log(err);
      res.render('error', {error: err});
  }
  sql_data = {
      "results": results
  }
});

/* GET home page. */
router.get('/main', function(req, res, next) {
  res.render('index', sql_data);
});

// 404 Error Handling
/* router.all('*',(req, res, next) => {
    res.status(404).render('error',{error: 404});
}); */

module.exports = router;
