import carrinhoController from "../carrinho/carrinho.controller.js";
import produtoController from "../produtos/produto.controller.js";
import usuarioController from "../usuarios/usuario.controller.js";
import { Router } from "express";

const rotasAutenticadas = Router ();

// Criando rotasAutenticadas para os usuários

rotasAutenticadas.post ( "/carrinho", carrinhoController.adicionar );
rotasAutenticadas.get ( "/carrinho", carrinhoController.listarItens );
rotasAutenticadas.delete ( "/carrinho", carrinhoController.deletarCarrinho );
rotasAutenticadas.post ( "/produtos", produtoController.adicionar );
rotasAutenticadas.get ( "/produtos", produtoController.listar );

rotasAutenticadas.get ( "/usuarios", usuarioController.listar );
rotasAutenticadas.post ( "/removerItensDoCarrinho", carrinhoController.removerItem );

export default rotasAutenticadas;