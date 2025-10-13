import usuarioController from "../src/usuarios/usuario.controller.js";
import produtoController from "../src/produtos/produto.controller.js";
import carrinhoController from "../src/carrinho/carrinho.controller.js";
import { Router } from "express";

const rotasAutenticadas = Router ();

// Criando rotasAutenticadas para os usuários

rotasAutenticadas.post   ( "/usuarios", usuarioController.adicionar                  );
rotasAutenticadas.get    ( "/usuarios", usuarioController.listar                     );
rotasAutenticadas.post   ( "/produtos", produtoController.adicionar                  );
rotasAutenticadas.get    ( "/produtos", produtoController.listar                     );
rotasAutenticadas.post   ( "/carrinho", carrinhoController.adicionar                 );
rotasAutenticadas.get    ( "/carrinho", carrinhoController.listarItens               );
rotasAutenticadas.delete ( "/carrinho", carrinhoController.deletarCarrinho           );
rotasAutenticadas.post   ( "/removerItensDoCarrinho", carrinhoController.removerItem );

export default rotasAutenticadas;