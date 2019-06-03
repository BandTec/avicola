// não mexa nestas 3 linhas!
var express = require('express');
var router = express.Router();
var banco = require('../app-banco');
// não mexa nessas 3 linhas!



router.post('/entrar', function (req, res, next) {

  banco.conectar().then(() => {
    console.log(`Chegou p/ login: ${JSON.stringify(req.body)}`);
    var login = req.body.login; // depois de .body, use o nome (name) do campo em seu formulário de login
    var senha = req.body.senha; // depois de .body, use o nome (name) do campo em seu formulário de login
    if (login == undefined || senha == undefined) {
      throw new Error(`Dados de login não chegaram completos: ${login} / ${senha}`);
    }
    return banco.sql.query(`select * from tb_cliente where email='${login}' and senhaUsuario='${senha}'`);
  }).then(consulta => {

    console.log(`Usuários encontrados: ${JSON.stringify(consulta.recordset)}`);

    if (consulta.recordset.length == 1) {
      res.send(consulta.recordset[0]);
    } else {
      res.sendStatus(404);
    }

  }).catch(err => {

    var erro = `Erro no login: ${err}`;
    console.error(erro);
    res.status(500).send(erro);

  }).finally(() => {
    banco.sql.close();
  });

});

router.post('/cadastrar', function (req, res, next) {

  banco.conectar().then(() => {
    console.log(`Chegou p/ cadastro: ${JSON.stringify(req.query)}`);
    var json = req.query;
    if(json.user == '' || json.password == '' || json.email == ''){
      console.log('Preencha todos os campos');
    }else{
      console.log('inserindo dados no banco');
      return banco.sql.query(`Insert into tb_cliente(nomeUsuario,senhaUsuario,Email) values ('${json.user}','${json.password}','${json.email}')`);
    }
    
  }).then(consulta => {

    
    res.status(200);
    res.send('ok');

  }).catch(err => {
    var erro = `Erro no cadastro+: ${err}`;
    console.error(erro);
    res.status(500).send(erro);

  }).finally(() => {
    banco.sql.close();
  });
});

router.get('/', function (req, res, next) {
 
  banco.conectar().then(() => {
    console.log(`Chegou p/ cadastro: ${JSON.stringify(req.query)}`);
    var json = req.query;
    return banco.sql.query(`Select * from tb_cliente where idcliente = ${json.id};`);
  }).then(consulta => {

    console.log(consulta.recordset)
    res.status(200);
    res.send(consulta.recordset);
  }).catch(err => {
    var erro = `Erro no login: ${err}`;
    console.error(erro);
    res.status(500).send(erro);

  }).finally(() => {
    banco.sql.close();
  });
});
router.get('/todos', function (req, res, next) {
  console.log(banco.conexao);
  
  banco.conectar().then(() => {

    return banco.sql.query(`select  
                             idcliente as 'Codigo',
                             nomeUsuario as 'Nome' ,
                             email as 'Email' 
                             from tb_cliente order by idcliente  `);
    //  para trazer os top 8 cadastros 
    // var limite_linhas = 8;
    // return banco.sql.query(`select top ${limite_linhas} 
    //                         idcliente as 'Codigo',
    //                         nomeUsuario as 'Nome',
    //                         email                     
    //                         from tb_cliente order by idcliente  `);
  }).then(consulta => {
    console.log(consulta.recordset);
    res.send(consulta.recordset);
  }).catch(err => {

    var erro = `Erro para trazer os dados cadastrados: ${err}`;
    console.error(erro);
    res.sendStatus(500).send(erro);

  }).finally(() => {
    banco.sql.close();
  });

});

// router.post('/cadastro', function (req, res, next) {

//   var cadastro_valido = false;

//   banco.conectar().then(() => {
//     console.log(`Chegou p/ cadastro: ${JSON.stringify(req.query)}`);
// 	  // nome = req.body.nome; // depois de .body, use o nome (name) do campo em seu formulário de login
//     // login = req.body.email; // depois de .body, use o nome (name) do campo em seu formulário de login
//     // senha = req.body.senha; // depois de .body, use o nome (name) do campo em seu formulário de login
//     var json1 = req.query;
//     if (json1.email_user == undefined || json1.senha_user == undefined || json1.nome_user == undefined) {
// 	  // coloque a frase de erro que quiser aqui. Ela vai aparecer no formulário de cadastro
//       throw new Error(`Dados de cadastro não chegaram completos: ${json1.email_user} / ${json1.senha_user} / ${json1.nome_user }`);
//     }
//     return banco.sql.query(`select count(*) as contagem from tb_cliente where email = '${json1.email_user}'`);
//   }).then(consulta => {

// 	if (consulta.recordset[0].contagem >= 1) {
// 		res.status(400).send(`Já existe usuário com o login "${json1.email_user}"`);
// 		return;
//     } else {
// 		console.log('válido!');
// 		cadastro_valido = true;
// 	}

//   }).catch(err => {

//     var erro = `Erro no cadastro: ${err}`;
//     console.error(erro);
//     res.status(500).send(erro);

//   }).finally(() => {
// 	  if (cadastro_valido) {		  
			  
//     banco.sql.query(`insert into tb_cliente (nomeUsuario, senhaUsuario, Email) 
//     values ('${json1.nome_user}','${json1.senha_user}','${json1.email_user}')`).then(function () {
// 			console.log(`Cadastro criado com sucesso!`);
// 			res.sendStatus(201); 
// 			// status 201 significa que algo foi criado no back-end, 
//         // no caso, um registro de usuário ;)
       
//       res.redirect('/Dashboard');
// 		}).catch(err => {

// 			var erro = `Erro no cadastro: ${err}`;
// 			console.error(erro);
// 			res.status(500).send(erro);

// 		}).finally(() => {
// 			banco.sql.close();
// 		});
// 	  }
//   });
// });



// não mexa nesta linha!
module.exports = router;