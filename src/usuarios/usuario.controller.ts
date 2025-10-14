import { Request, Response } from "express";
import { db } from "../database/banco-mongo.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class UsuarioController {

    async adicionar ( req: Request, res: Response ) {

        const {nome, idade, email, senha} = req.body as {nome:string, idade:number, email:string, senha:string}

        if ( ! nome || ! email || ! senha || ! idade ) {

            res.status ( 400 ) .json ( { mensagem: "Dados incompletos ( nome, idade, email, senha )" } )

        }

        const senhaCriptografada = await bcrypt.hash ( senha, 10 )
        const usuario = { nome, idade, email, senha:senhaCriptografada }
        const resultado = await db.collection ( 'usuarios' ) .insertOne ( usuario )

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

        const usuario = await db.collection ( "usuarios" ) .findOne ( { email } )

        if ( ! usuario ) return res.status ( 200 ) .json ( { mensagem: "Usuário incorreto!" } );

        const senhaValida = await bcrypt.compare ( senha, usuario.senha )

        if ( ! senhaValida ) return res.status ( 400 ) .json ( { mensagem: "Senha invalida" } )

        // Criar Token.

        const token = jwt.sign ( { usuarioId:usuario._id }, process.env.JWT_SECRET!, { expiresIn: '3h' } )

        // Devolver o Token.

        res.status ( 200 ) .json ( { token } )

    } }

export default new UsuarioController ();