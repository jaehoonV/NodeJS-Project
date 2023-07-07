let express = require('express');
let router = express.Router();

let authCheck = require('../public/script/authCheck.js');
// mariaDB Connection
const maria = require('../ext/conn_mariaDB');

router.use(express.static("public"));

router.get('/', (req, res) => {
  if (!authCheck.isOwner(req, res)) {  // login page
    res.redirect('/login');
    return false;
  } else {
    res.render('2048_daily');
    return false;
  }
})

router.post('/save', (req, res) => {
  console.log(req.body);
  let sql_mine_insert = "INSERT INTO GAME_RECORD(SEQ,SCORE,NAME,REGDAY) "
    + "VALUES( NEXTVAL(GAME_SEQ), ?, ?, CURRENT_DATE()); ";

  maria.query(sql_mine_insert,
    [req.body.save_score, req.body.save_name],
    function (err, result) {
      if (err) {
        console.log(err);
        res.render('error', { error: err });
      } else {
        console.log("1 record inserted!");
        res.redirect('/2048_daily');
      }
    });
})

// 404 Error Handling
router.all('*', (req, res, next) => {
  res.status(404).render('error', { error: 404 });
});

module.exports = router;