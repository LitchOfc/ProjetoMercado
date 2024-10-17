const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const sqlite = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

//Abaixo estamos criando um arquivo de banco de dados do tipo sqlite
const db = new sqlite.Database("Database.sqlite")

app.use(express.static(path.join(__dirname, "public")))

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get("/cadastro", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cadastro.html'));
});

app.post("/inserircadastrados", function (req, res) {

  console.log(req.body);
      
  var nome = req.body.nome;
  var email = req.body.email;
  var cpf = req.body.cpf;
  var data_nascimento = req.body.data_nascimento;
  var celular = req.body.celular;
  var senha = req.body.senha;
      
  //Criptografa a senha
  //const criptografia = bcrypt.hashSync(senha, 10);

  var sql = "INSERT INTO CADASTRADOS ( NOME, EMAIL, CPF, DATA_NASCIMENTO, CELULAR, SENHA) VALUES ( ?, ?, ?, ?, ?, ?, ? )";
      
  db.run(sql, [nome, email, cpf, data_nascimento, celular, senha, confirmar_senha ], (err) => {
      if(err) res.send(err, "Erro ao Cadastrar");
      else res.send("Dados Inseridos com Sucesso!");
  });
  
  });



/*app.post("/logados", function (req, res) {

     console.log(req.body);
    
    var login = req.body.login;
    var senha = req.body.senha;
    
    // Verifica o usuário no banco
    db.get('SELECT * FROM CADASTRADOS WHERE EMAIL = ?', [email], (err, user) => {
         if (err || !user) {
             return res.send('Usuário não encontrado.');
          }
    
        // Compara a senha
        if (bcrypt.compareSync(senha, user.senha)) {
            res.send('Login realizado com sucesso!');
        } else {
            res.send('Senha incorreta.');
        }
    });
});
*/



app.get("/consultar", (req, res) => {
    
    var sql = "SELECT * FROM CADASTRADOS";
    
    db.all(sql, (err, rows) => {
    
        if(err) res.send(err);
        else res.json(rows);
    
    });
    
});

/*criar_tabela_usuarios()*/
function criar_tabela_usuarios() {
  var query = "CREATE TABLE IF NOT EXISTS CADASTRADOS (";
  query += "ID INTEGER PRIMARY KEY AUTOINCREMENT,";
  query += "NOME VARCHAR,";
  query += "CPF VARCHAR)";
  query += "DATA_NASCIMENTO VARCHAR)";
  query += "CELULAR VARCHAR)";
  query += "SENHA VARCHAR)";

  db.run(query, (err) => {
      if (err) console.log(err);
      else console.log("Tabela criada com sucesso!")
  });
}

  app.listen(3000, console.log("Rodando..."))