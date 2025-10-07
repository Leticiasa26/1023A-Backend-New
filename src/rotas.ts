import { Router } from "express";
import usuarioController from "./usuarios/usuario.controller.js";
import produtoController from "./produtos/produto.controller.js";
import carrinhoController from "./carrinho/carrinho.controller.js";

const rotas = Router ();

// Criando rotas para os usuários

rotas.post ( "/usuarios", usuarioController.adicionar  );
rotas.get  ( "/usuarios", usuarioController.listar     );
rotas.post ( "/produtos", produtoController.adicionar  );
rotas.get  ( "/produtos", produtoController.listar     );
rotas.post ( "/carrinho", carrinhoController.adicionar );

//rotas.get  ( "/carrinho", carrinhoController.listar    );
//rotas.post ( "/adicionarItem", carrinhoController.adicionarItem);

export default rotas;