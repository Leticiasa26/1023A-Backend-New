import 'dotenv/config'
import express from 'express';
import rotasAutenticadas from '../rotas/rotas-autenticadas.js';
import rotasNaoAutenticadas from '../rotas/rotas-nao-autenticadas.js';
import { NextFunction,Request,Response } from "express";

const app = express ();

// Explicando o que é um Middleware

function Middleware ( req:Request, res:Response, next:NextFunction ) {
    
    return res.status ( 401 ) .json ( { mensasgem: "Você não tem permissão para acessar este recurso" } )
}

app.use(rotasNaoAutenticadas)
app.use (Middleware)
app.use(rotasAutenticadas);
app.listen ( 8000, () => {

    console.log ( 'O servidor está rodando na porta 8000' );

} );