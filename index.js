var express = require("express");
var mysql = require("mysql");
var cors = require("cors");
var bodyparser = require("body-parser");
const e = require("express");
var app = express();

app.use(cors());
app.use(bodyparser.json());
app.listen("5000", () => {
  console.log("server running at port 5000");
});

var db = mysql.createConnection({
  host: "database-1-ngo.clj4lnumgcmv.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "admin1234",
  database: "NGO",
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("database conected");
  }
});

// // // // GET API

app.get("/api/Login/get/Password/:number", (req, res) => {
  let sql = ` select P_Password AS Password from Participant_Login where P_Number = "${req.params.number}";
                `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/api/User/RegisteredEvent/:number", (req, res) => {
  let sql = ` select Events.E_ID,Events.NGO_ID,Events.E_Name,Events.E_date,Events.time, NGO_Details.NGO_Name 
                from Events,NGO_Details
                where  
                Events.E_ID in 
                (select E_ID from Participating where P_Number = "${req.params.number}") 
                and 
                NGO_Details.NGO_ID = Events.NGO_ID;
                `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/api/User/UnRegisteredEvent/:number", (req, res) => {
  let sql = ` select Events.E_ID,Events.NGO_ID,Events.E_Name,Events.E_date,Events.time, NGO_Details.NGO_Name 
                from Events,NGO_Details
                where  
                Events.E_ID not in 
                (select E_ID from Participating where P_Number = "${req.params.number}") 
                and 
                NGO_Details.NGO_ID = Events.NGO_ID;
                `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/get/NGO/AllEvent/:NGO_ID", (req, res) => {
  let sql = ` select * from Events where NGO_ID = "${req.params.NGO_ID}";
                `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// // // // GET API

// // // // POST API
app.post("/api/post/NGO/newEvent", (req, res) => {
  let sql = ` insert into Events values (null,"${req.body.NGO_ID}","${req.body.E_Name}","${req.body.E_date}","${req.body.time}"); 
                `;

  console.log(req.body);

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("Successfully Entered");
    }
  });
});

app.post("/api/post/User/register", (req, res) => {
  let sql = ` insert into Participating values("${req.body.E_ID}","${req.body.P_Number}");
              `;

  console.log(req.body);

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("Successfully Entered");
    }
  });
});

// // // // DELETE API
app.delete("/api/delete/User/unRegister/:ID&:Number", (req, res) => {
  let sql = ` delete from Participating where E_ID = "${req.params.ID}" and P_Number = "${req.params.Number}"; `;

  console.log(req.params);

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("Successfully Unregistered");
    }
  });
});

app.delete("/api/delete/NGO/Event/:ID", (req, res) => {
    
    let sql_participating = ` delete from Participating where E_ID = "${req.params.ID}";
                `;

    console.log(req.params);

  db.query(sql_participating, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      let sql_events = ` delete from Events where E_ID = "${req.params.ID}";
                `;

      db.query(sql_events, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Successfully Deleted");
        }
      });
    }
  });
});
