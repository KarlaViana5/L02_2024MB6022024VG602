const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedidosController');
const { validarId, validarPedido, validarParametroNumerico } = require('../middlewares/validaciones');

router.get('/', controller.obtenerPedidos);
router.get('/cliente/:idUsuario', validarParametroNumerico('idUsuario'), controller.pedidosPorCliente);
router.get('/:id', validarId, controller.obtenerPedidoPorId);
router.post('/', validarPedido, controller.crearPedido);
router.put('/:id', validarId, validarPedido, controller.actualizarPedido);
router.delete('/:id', validarId, controller.eliminarPedido);

module.exports = router;
