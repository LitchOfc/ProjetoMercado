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

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get("/cadastro", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cadastro.html'));
});

app.get("/pagina_principal", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pagina_principal.html'));
});

app.post("/inserircadastrados", function (req, res) {

    console.log(req.body);

    var nome = req.body.nome;
    var email = req.body.email;
    var cpf = req.body.cpf;
    var data_nascimento = req.body.date;
    var celular = req.body.celular;
    var senha = req.body.senha;

    //Criptografa a senha
    const criptografia = bcrypt.hashSync(senha, 10);

    var sql = "INSERT INTO CADASTRADOS ( NOME, EMAIL, CPF, DATA_NASCIMENTO, CELULAR, SENHA) VALUES ( ?, ?, ?, ?, ?, ? )";

    db.run(sql, [nome, email, cpf, data_nascimento, celular, criptografia], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: "Erro ao cadastrar: " + err.message });
        }
        res.status(200).json({ success: true, message: "Cadastrado com sucesso" });

    });
});

app.post("/logados", function (req, res) {

    console.log(req.body)

    var email = req.body.email;
    var senha = req.body.senha;

    db.all('SELECT * FROM USUARIOS', (err, rows) => {
        if (err) res.send(err);
        else {

            var check = false;

            for (x = 0; x < rows.length; x++) {

                if (email == rows[x].EMAIL && senha == rows[x].SENHA) check = true;

            }

            if(check) res.send("https://www.google.com.br");
            else res.send("/");
        }
    });
});

function deletar_tabela() {
    const tableName = 'cadastrados'; // nome da tabela correto

    const dropTabela = "DROP TABLE IF EXISTS CADASTRADOS";

    db.run(dropTabela, (err) => {
        if (err) {
            return console.error(`Erro ao excluir a tabela: ${err.message}`);
        }
        console.log(`Tabela ${tableName} excluída com sucesso!`);
        res.send(`Tabela ${tableName} excluída com sucesso!`);
    });
};

app.get("/consultar", (req, res) => {

    var sql = "SELECT * FROM CADASTRADOS";

    db.all(sql, (err, rows) => {

        if (err) res.send(err);
        else res.json(rows);

    });
});

function criar_tabela_usuarios() {
  var query = "CREATE TABLE IF NOT EXISTS CADASTRADOS (";
  query += "ID INTEGER PRIMARY KEY AUTOINCREMENT,";
  query += "NOME VARCHAR,";
  query += "EMAIL VARCHAR,";
  query += "CPF VARCHAR,";
  query += "DATA_NASCIMENTO VARCHAR,";
  query += "CELULAR VARCHAR,";
  query += "SENHA VARCHAR)";

  db.run(query, (err) => {
      if (err) console.log(err);
      else console.log("Tabela criada com sucesso!")
  });
}

function tabela_usuarios() {
    var query = "CREATE TABLE USUARIOS (";
    query += "ID INTEGER PRIMARY KEY AUTOINCREMENT,";
    query += "EMAIL VARCHAR,";
    query += "SENHA VARCHAR )";

    db.run(query, (err) => {
        if (err) console.log(err);
        else console.log("Tabela criada com sucesso!")
    });
}

function insert() {
    var query = "INSERT INTO USUARIOS (EMAIL, SENHA) VALUES ('MARIA@EMAIL.COM', '123')";
    db.run(query, (err) => {
        if (err) console.log(err);
        else console.log("Tabela criada com sucesso!")
    });
}

app.listen(3000, console.log("Rodando..."))
