const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());


const port = 5001;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'zero',
});

function createNewSession(id){
  
  tokensql = 'INSERT INTO tokens (userid, token, expires, sessions) VALUES(?, ?, ?, ?)';
  const token = Math.round((Math.random() * (-123456789111315 + 523456789111315)) + 123456789111315);
  db.query(tokensql, [id, token, 24, 1], (err, results) => {
    if (err) return  [false,err]
    return  [true,token];
  })
  return  [true,token];
}

function killToken(token){
  
  var mes=[];
  tokensql = 'UPDATE tokens SET sessions = 1 WHERE tokens.token = ?';
  db.query(tokensql, [token], (err, results) => {
    if (err) return [false,err]
    return [true,token];
  })
  return [true,token];

}

app.post('/coin', (req,res)=>{
  obj = req.body;
  checksql = "SELECT userid FROM tokens WHERE token= ?";
  sql = 'SELECT coins FROM users WHERE id= ?';
  sql2 = 'UPDATE users set coins=? WHERE id= ? ';
  const values = [obj.token];

  db.query(checksql, values, (err, result) => {
    if (err) return res.json({ message: 'sorry but  an error occured'+err})
    if (result.length > 0) {
      db.query(sql, [result[0].userid], (err, results) => {
        if (err) return res.json({ message: 'sorry but  an error occured'+err})
        const coin=results[0].coins;
        const newcoin= ((coin-1)+2);
        if (results.length > 0) { 
          db.query(sql2, [ newcoin, result[0].userid], (err, result) => {
            if (err) return res.json({ message: 'sorry but  an error occured'+err})
            return res.json({ message: 'sucessfull', coins:newcoin }) ;

          })

        } else { 
          return res.json({ message: '2no response found' })
        }
      })
    } else {
      return res.json({ message: '1no response found' })
    }

  })
})
app.post('/index_data', (req, res)=>{
    obj = req.body;
    checksql = "SELECT userid FROM tokens WHERE token= ?";
    sql = 'SELECT firstname, lastname, email, coins FROM users WHERE id= ?';
    const values = [obj.token];
    
  
    db.query(checksql, values, (err, result) => {
      
      if (err) return res.json({ message: '1sorry but  an error occured'+err })
      if (result.length > 0) {
        
        db.query(sql, [result[0].userid], (err, result) => {
          
          if (err) return res.json({ message: '2sorry but  an error occured'+err})
          const r=result[0];
          //console.log(r)
          if (result.length > 0) { 
           
            return res.json({ message: 'sucessfull', firstname: r.firstname, lastname: r.lastname, email: r.email, coins: r.coins }) ;
  
          } else { 
            return res.json({ message: '2no response found' })
          }
        })
      } else {
        return res.json({ message: '1no response found' })
      }
  
    })

})
app.post('/user_login', (req, res) => {
  obj = req.body;
  checksql = "SELECT id FROM users WHERE email= ?";
  sql = 'SELECT id FROM users WHERE email= ? AND password= ?';
  tsql = 'SELECT token FROM tokens WHERE userid= ? AND sessions=?';
  const values = [
    obj.email,
    obj.password,

  ];

  db.query(checksql, [obj.email], (err, result) => {
    if (err) return res.json({ message: 'sorry but  an error occured' })
      
    if (result.length > 0) {
      db.query(sql, values, (err, result) => {
        if (err) return res.json({ message: 'sorry but  an error occured'})

        if (result.length > 0) { 
          //console.log(result[0].id)
          db.query(tsql, [result[0].id,0], (err, results) => {
            if (err) return res.json({ message: 'sorry but an error occured'})
              console.log(results.length)
              if (results.length > 0) {
                db.query(sql, values, (err, rez) => {
                  if (err) return res.json({ message: 'sorry but an error occured'})
                  k= killToken(results[0].token);
                  console.log(k)
                  if(k[0])return res.json({ message: 'sucessfull', insertId: result.userid, token: k[1] })
                  else return res.json({ message: k[1],})
                })
              }else{
                g=createNewSession(result[0].id);
                if(g[0]) return res.json({ message: 'sucessfull', insertId: result[0].id, token: g[1]});
                else return res.json({ message: g[1]})
              }
          })
        } else { 
          return res.json({ message: 'wrong password' })
        }
      })
    } else {
      return res.json({ message: 'sorry this email is not found' })
    }

  })
})
app.post('/add_user', (req, res) => {
    obj = req.body;
    sql = "INSERT INTO users (firstname, lastname, password, email, gender, coins, type) VALUES (?, ?, ?, ?, ?, ?, ?)";
    checksql = `SELECT * FROM users WHERE email= ?`;

    const values = [
      obj.firstname,
      obj.lastname,
      obj.password,
      obj.email,
      obj.gender,
      0,
      1

    ];

    db.query(checksql, [obj.email], (err, result) => {
      if (err) return res.json({ message: 'sorry but ' + err })
      if (result.length < 1) {
        db.query(sql, values, (err, result) => {
          if (err) return res.json({ message: 'sorry but ' + err })

            if (err) return res.json({ message: 'sorry but ' + err })
              d=createNewSession(result.insertId)
            if(d[0]) return res.json({ message: 'sucessfull', insertId: result.insertId, token: d[1] })
            else console.log();return res.json({ message: 'sorry but ' + err })

        })
      } else {
        return res.json({ message: 'user with this email already exist' })
      }
    })



})

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
