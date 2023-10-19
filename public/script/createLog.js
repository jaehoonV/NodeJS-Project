module.exports = {
    insertLog: function (req, res, event) {
        var requestIp = require('request-ip');

        // mariaDB Connection
        const maria = require('../../ext/conn_mariaDB');

        let sql_login_log = "INSERT INTO EVENT_LOG(SEQ,EMAIL,USERNAME,EVENT,EVENT_IP,REGDAY) VALUES( NEXTVAL(LOG_SEQ), ?, ?, ?, ?, CURRENT_TIMESTAMP); ";
        
        let req_email = "";
        let req_username = "";

        if(req.session){
            if (req.session.is_logined) {
                req_email = req.session.email;
                req_username = req.session.username;
            }
        }

        maria.query(sql_login_log,
            [req_email, req_username, event, requestIp.getClientIp(req)], 
            function (err, log_result) {
            if (err) {
                console.log(err);
                res.render('error', {error: err});
            } else{
                console.log(event + " Log inserted!");
            }
        });
    }

}