import { db } from "../database/banco-mongo.js";
import { Request, Response } from "express";
import { ObjectId } from "bson";

interface Carrinho {

    dataAtualizacao:Date;
    itens:ItemCarrinho [];
    total:number;
    usuarioId:string;

}

interface ItemCarrinho {

    nome:string;
    precoUnitario:number;
    produtoId:string;
    quantidade:number;

}

interface Produto {

    descricao:string;
    _id:ObjectId;
    nome:string;
    preco:number;
    urlfoto:string;

}

class CarrinhoController {

// Adicionar item

    async adicionar ( req:Request, res:Response ) {

        const { produtoId, quantidade, usuarioId } = req.body as { usuarioId:string, produtoId:string, quantidade:number };
        console.log ( produtoId, quantidade, usuarioId )

// Buscar o produto

        const produto = await db.collection < Produto > ( "produtos" ) .findOne ( { _id:ObjectId.createFromHexString ( produtoId ) } );

            if ( ! produto ) {

            return res.status ( 404 ) .json ( { mensagem: "Produto não encontrado" } ) };

// Pegar nome e preço do produto

        const nomeProduto = produto.nome;
        const precoProduto = produto.preco;

// Verificar se usuário já possui carrinho

        const carrinho = await db.collection < Carrinho > ( "carrinhos" ) .findOne ( { usuarioId:usuarioId } );

        if ( ! carrinho ) {

            const novoCarrinho: Carrinho = {

                usuarioId: usuarioId,
                itens: [ {

                    nome:nomeProduto,
                    precoUnitario:precoProduto,
                    produtoId:produtoId,
                    quantidade:quantidade
                   
                } ], 
            
                dataAtualizacao:new Date (),
                total:precoProduto * quantidade
            
            }  
        
        const resp = await db.collection < Carrinho > ( "carrinhos" ) .insertOne ( novoCarrinho );
        const carrinhoResp = {

            dataAtualizacao:novoCarrinho.dataAtualizacao,
            _id:resp.insertedId,
            itens:novoCarrinho.itens,
            total:novoCarrinho.total,
            usuarioId:novoCarrinho.usuarioId

        };

// Early return

        return res.status ( 201 ) .json ( carrinhoResp );

        } 

// Se existir, adicionar item ao carrinho

        const itemExistente = carrinho.itens .find ( item => item.produtoId === produtoId );

        if ( itemExistente ) {

        itemExistente.quantidade += quantidade;
        carrinho.total += precoProduto * quantidade;
        carrinho.dataAtualizacao = new Date ();

        } else {

            carrinho.itens .push ( { 

                produtoId:produtoId,
                quantidade:quantidade,
                precoUnitario:precoProduto,
                nome:nomeProduto

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

// Remover item

    async removerItem ( req:Request, res:Response ) {

    const { produtoId, usuarioId } = req.body as { produtoId: string, usuarioId: string }
    const carrinho = await db.collection < Carrinho > ( "carrinhos" ) .findOne ( { usuarioId: usuarioId } )

    if ( ! carrinho ) {

        return res.status ( 401 ) .json ( { mensagem: "O seu carrinho não existe" } );
    }

    const itemExistente = carrinho.itens.find ( item => item.produtoId === produtoId );

    if ( ! itemExistente ) {

        return res.status ( 401 ) .json ( { mensagem: "Esse item não existe no seu carrinho" } );

    }

    const TotalAntigo = carrinho.total;
    const TotalNovo = TotalAntigo - itemExistente?.precoUnitario * itemExistente?.quantidade;
    const carrinhoUpdate = await db.collection < Carrinho > ( "carrinhos" ) .updateOne ( 

        { usuarioId: usuarioId },

        { $set: {

                dataAtualizacao: new Date (),
                total: TotalNovo

            },

            $pull: {

                itens: { produtoId: produtoId }

            } }

    );

    } 

// Listar itens
    
    async listarItens ( req:Request, res:Response ) {

        const { usuarioId } = req.body as { usuarioId: string }
        const carrinho = await db.collection < Carrinho > ( "carrinhos" ) .findOne ( { usuarioId: usuarioId } )

        if ( ! carrinho ) {

            return res.status ( 401 ) .json ( { mensagem: "O seu carrinho não existe" } );
        }

        return res.status ( 200 ) .json ( carrinho.itens );

    }
    
// Deletar carrinho    

    async deletarCarrinho ( req:Request, res:Response ) {

        const { usuarioId } = req.body as { usuarioId:string }
        const carrinho = await db.collection < Carrinho > ( "carrinhos" ) .deleteOne ( { usuarioId: usuarioId } )

        if ( ! carrinho.acknowledged ) {

            return res.status ( 401 ) .json ( { mensagem: "carrinho falhou em ser apagado" } );

        }

        return res.status ( 200 ) .json ( { mensagem: "O seu carrinho apagado" } );

    } 

// Atualizar quantidade

    async atualizarQuantidade ( req:Request, res:Response ) {
        
        const { produtoId, usuarioId, quantidade } = req.body as { produtoId: string, usuarioId: string, quantidade: number };
        const carrinhoAnt = await db.collection < Carrinho > ( "carrinhos" ) .findOne ( { usuarioId:usuarioId } );

        if ( ! carrinhoAnt ) {

            return res.status ( 401 ) .send ( { mensagem: "Seu carrinho não foi encontrado" } )

        }
        
        const itemCarrinho = carrinhoAnt?.itens .find ( item => item.produtoId === produtoId );

        if ( ! itemCarrinho ) return res.status ( 201 ) .send ( { mensagem: "Item dentro do carrinho não encontrado" } )
        
        const quantidadeAntiga = itemCarrinho.quantidade

        if ( itemCarrinho.quantidade + quantidade < 0 ) {

            return res.status ( 401 ) .send ( { mensagem: "Não pode ter quantidade negativa" } )
        }

        const valorIncTotal = itemCarrinho.precoUnitario * quantidade
        const ObjectIdProduto = ObjectId.createFromHexString ( produtoId )
        const carrinho = await db.collection < Carrinho > ( "carrinhos" ) .updateOne (

            { usuarioId: usuarioId, "itens._id": produtoId },

            { $set: {

                    dataAtualizacao: new Date (),
                    "itens.$.quantidade": quantidade

                },

                $inc: {

                    total: ( -quantidadeAntiga * itemCarrinho.precoUnitario ) + valorIncTotal 

                },

            }

        );

        if ( carrinho.modifiedCount ) {

            return res.status ( 200 ) .json ( { mensagem: "Quantidade Atualizada" } );

        } else { 

            return res.status ( 401 ) .json ( { mensagem: "Item ou carrinho não encontrado", erro: carrinho.modifiedCount } )

        } } }

export default new CarrinhoController ();