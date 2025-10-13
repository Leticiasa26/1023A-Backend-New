import { Request, Response } from "express";
import { db } from "../database/banco-mongo.js";
import bcrypt from 'bcrypt'

class UsuarioController {

    async adicionar ( req: Request, res: Response ) {

        const { nome, idade, email, senha } = req.body

        if ( ! nome || ! email || ! senha || ! idade ) {

            res.status ( 400 ) .json ( { mensagem: "Dados incompletos ( nome, idade, email, senha )" } )

        }

        const senhaCriptografada = await bcrypt.hash ( senha, 10 )
        const usuario = { nome, idade, email, senha:senhaCriptografada }
        const resultado = await db.collection ( 'ususarios' ) .insertOne ( usuario )

        res.status ( 201 ) .json ( { ...usuario, _id: resultado.insertedId } )

    }

    async listar ( req: Request, res: Response ) {

        const usuarios = await db.collection ( 'usuarios' ) .find () .toArray ();

        res.status ( 200 ) .json ( usuarios );

    } 

    async login ( req:Request, res:Response ) {

        // Recebe email e senha.

        const { email, senha } = req.body

        if ( ! email || ! senha ) return res.status ( 400 ) .json ( { mensagem: "Email e senha são obrigatórios!" } )
        
        // Verifica se o usuário e senha estão corretos no banco.

        const usuario = await db.collection ( "usuario" ) .findOne ( { email } )

        if ( ! usuario ) return res.status ( 200 ) .json ( { mensagem: "Usuário incorreto!" } );

        const senhaValida = await bcrypt.compare ( senha, usuario.senha )

        //  criar Token, devolver o Token.

    } }

export default new UsuarioController ();