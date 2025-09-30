import { Request, Response } from "express";
import { db } from "../database/banco-mongo.js";

interface ItemCarrinho {

    nome: string;
    precoUnitario: number;
    produtoId: string;
    quantidade: number;

}

interface Carrinho {

    dataAtualizacao: Date;
    itens: ItemCarrinho [];
    total: number;
    usuarioId: string;

}

// AdicionarItem - Um carrinho para cada usuário - Um tipo de produto por carrinho.

class CarrinhoController {

    async adicionar ( req: Request, res: Response ) {

        const { usuarioId, item } = req.body
        const carrinhoExistente = await db.collection ( 'carrinho' ) .insertOne ( { usuarioId } );

            if ( carrinhoExistente ) {

                // Atualizar carrinho existente
                // Verificar se item já está no carrinho

            } else {

                const novoCarrinho: Carrinho = {

                    usuarioId,
                    dataAtualizacao: new Date (),
                    itens: [ item ],
                    total: item.precoUnitario * item.quantidade

                };

                const result = await db.collection ( 'carrinho' ) .insertOne ( novoCarrinho );

                return res.status ( 201 ) .json ( { _id: result.insertedId } );
                
            }

        const atualizarCarrinho = ( carrinho : Carrinho ) => {
        const itemExistente = carrinho.itens.find ( ( i ) => i.produtoId === item.produtoId );

        }

        res.status ( 201 ) .json ( { ...usuarioId, _id: carrinhoExistente.insertedId } )

    }

    async listar ( req: Request, res: Response ) {

        const produtos = await db.collection ( 'produtos' ) .find () .toArray ();

        res.status ( 200 ) .json ( produtos );

    } } 

export default new CarrinhoController ();

// RemoverItem - Excluir item.
// AtualizarQuantidade.
// Listar.
// Remover - Excluir carrinho.