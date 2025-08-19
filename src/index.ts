import 'dotenv/config'
import express from 'express';

console.log ( process.env.DBUSER );
const app = express ();

app.get ( '/', ( req, res ) => {
    res.send ( process.env.DBUSER );
});

app.listen ( 8000, () => {
    console.log ( 'O servidor está rodando na porta 8000');
});