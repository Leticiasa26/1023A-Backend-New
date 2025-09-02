import 'dotenv/config'
import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';

const app = express ();

// ! singifica que é a negação da variável 

app.get ( '/', async ( req:Request, res:Response ) => {

    if ( ! process.env.DBHOST ) {
        res.status ( 500 ) . send ( "Variável de ambiente DBHOST não está difinida" )
        return;
    }    

    if ( ! process.env.DBUSER ) {
        res.status ( 500 ) .send ( "Variável de ambiente DBUSER não está definida" )
        return;
    }

    if ( process.env.DBPASSWORD == undefined ) {
        res.status ( 500 ) .send ( "Variável de ambiente DBPASSWORD não está definida" )
        return;
    }

    if ( ! process.env.DBNAME ) {
        res.status ( 500 ) .send ( "Variável de ambiente DBNAME não está definida" )
        return;
    }

    if ( ! process.env.DBPORT ) {
        res.status ( 500 ) .send ( "Variável de ambiente DBPORT não está definida" )
        return;
    }

    try {

    const connection =  await mysql.createConnection ( {
    
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        database: process.env.DBNAME,
        port: Number ( process.env.DBPORT )
    
    } )

    res.send ( "Conectado ao bando de dados com sucesso!" )

    await connection.end ();

}

catch ( error ) {

    res.status ( 500 ) .send ( " Erro ao conectar ao banco de dados: " + error );

}

    res.send ( process.env.DBUSER );

});

app.listen ( 8000, () => {

    console.log ( 'O servidor está rodando na porta 8000' );
    
});

// Tarefa - Criar uma rota get para produtos que retorne a lista de produtos do Bando de Dados, o produto deve ter Id, Nome, Preço, URL Foto e Descrição. Deve - se criar uma tabela no Banco de Dados Aiven para armazenar os produtos e a resposta deve ser um array de produtos em formato JSON. 

app.get ( '/produtos', async ( req:Request, res:Response ) => {

    try {

        const connection = await mysql.createConnection ( {

            host: process.env.DBHOST ? process.env.DBHOST: 'error localhost',
            user: process.env.DBUSER ? process.env.DBUSER: 'error user',
            password: process.env.DBPASSWORD ? process.env.DBPASSWORD: '',
            database: process.env.DBNAME ? process.env.DBNAME: "error name",
            port: Number ( process.env.DBPORT ? process.env.DBPORT: "3306" )

        });

        const produtos = await connection.query ( "SELECT * FROM produtos" )

        res.send ( produtos [ 0 ] );

    } catch ( error ) {

        console.log ( "erro ao conectar", error )
        
        }
    
});