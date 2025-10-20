import usuarioController from "../usuarios/usuario.controller.js";
import { Router } from "express";

const rotasNaoAutenticadas = Router ();

rotasNaoAutenticadas.post ( "/login", usuarioController.login );
rotasNaoAutenticadas.post ( "/usuarios", usuarioController.adicionar );

export default rotasNaoAutenticadas;