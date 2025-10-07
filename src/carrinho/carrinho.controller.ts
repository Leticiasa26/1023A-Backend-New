import { db } from "../database/banco-mongo.js";
import { ObjectId } from "bson";
import { Request, Response } from "express";

interface Carrinho {

    dataAtualizacao: Date;
    itens: ItemCarrinho [];
    total: number;
    usuarioId: string;

}

interface ItemCarrinho {

    nome: string;
    precoUnitario: number;
    produtoId: string;
    quantidade: number;

}

interface Produto {

    descricao: string;
    _id: ObjectId;
    nome: string;
    preco: number;
    urlfoto: string;

}

class CarrinhoController {

// Adicionar item

    async adicionar ( req: Request, res: Response ) {

        const { produtoId, quantidade, usuarioId } = req.body as { usuarioId: string, produtoId: string, quantidade: number };
        console.log ( produtoId, quantidade, usuarioId )

// Buscar o produto no banco de dados

        const produto = await db.collection < Produto > ( "produtos" ) .findOne ( { _id: ObjectId.createFromHexString ( produtoId ) } );

            if ( ! produto ) {

            return res.status ( 404 ) .json ( { mensagem: "O produto não foi encontrado" } ) };

// Pegar o nome e o preço do produto

        const nomeProduto = produto?.nome;
        const precoProduto = produto?.preco;

// Verificar se o usuário já possui um carrinho

        const carrinho = await db.collection < Carrinho > ( "carrinhos" ) .findOne ( { usuarioId: usuarioId } );

        if ( !carrinho ) {

            const novoCarrinho: Carrinho = {

                usuarioId: usuarioId,
                itens: [ {

                    nome: nomeProduto,
                    precoUnitario: precoProduto,
                    produtoId: produtoId,
                    quantidade:quantidade
                   
                } ], 
            
                dataAtualizacao: new Date (),
                total: precoProduto * quantidade
            
            }  
        
        const resp = await db.collection < Carrinho > ( "carrinhos" ) .insertOne ( novoCarrinho );
        const carrinhoRes = {

            dataAtualizacao: novoCarrinho.dataAtualizacao,
            _id: resp.insertedId,
            itens: novoCarrinho.itens,
            total: novoCarrinho.total,
            usuarioId: novoCarrinho.usuarioId

        };

// Early return

        return res.status( 201 ) .json ( carrinhoRes );

        } 

// Se existir, deve adicionar o item ao carrinho existente

        const itemExistente = carrinho.itens.find ( item => item.produtoId === produtoId );

        if ( itemExistente ) {

        itemExistente.quantidade += quantidade;
        carrinho.total += precoProduto * quantidade;
        carrinho.dataAtualizacao = new Date ();

        } else {

            carrinho.itens.push ( { 

                produtoId: produtoId,
                quantidade: quantidade,
                precoUnitario:precoProduto,
                nome: nomeProduto

            } );

            carrinho.total += precoProduto * quantidade;
            carrinho.dataAtualizacao = new Date ();

        }

// Atualizar o carrinho no banco de dados

    await db.collection < Carrinho > ( "carrinhos" ) .updateOne ( { usuarioId: usuarioId },

          { $set: {

                itens: carrinho.itens,
                total: carrinho.total,
                dataAtualizacao: carrinho.dataAtualizacao

            } } 
     )

        res.status ( 200 ) .json ( carrinho );

    }

     async removerItem ( req:Request, res:Response ) {}

}
   
export default new CarrinhoController ();