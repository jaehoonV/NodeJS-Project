let express = require('express');
let router = express.Router();

// mariaDB Connection
const maria = require('../ext/conn_mariaDB');

router.use(express.static("public"));

router.get('/', (req, res) => {
    res.render('chat_container');
})

let sql_1 = "select a.contents, a.reg_id, a.reg_date, date_format(a.reg_date, '%y-%c-%e') reg_day, date_format(a.reg_date, '%h:%i') reg_time, "
            + "case when reg_id = ? then 'mine' else 'other' end mine_div, "
            + "count(b.member_seq) - count(b.read_date) unread_num "
            + "from ex1.chat_contents a, ex1.chat_read_history b "
            + "where a.contents_seq = b.contents_seq and a.master_seq = ? "
            + "group by a.contents, a.reg_id, a.reg_date "
            + "order by a.reg_date";

router.post('/', (req, res) => {
    console.log(req.body);
    let sql_data;
    maria.query(sql_1, [req.body.user, req.body.master_seq], function (err, results) {
      if (err) {
          console.log(err);
          res.render('error', {error: err});
      }
      sql_data = {
        "results_1" : results,
      }
      res.json(sql_data);
    });
  })

// 404 Error Handling
router.all('*',(req, res, next) => {
    res.status(404).render('error',{error: 404});
});

module.exports = router;