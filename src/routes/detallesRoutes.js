const express = require('express');
const router = express.Router();
const controller = require('../controllers/detallesController');
const { validarId, validarDetalle, validarParametroNumerico } = require('../middlewares/validaciones');

router.get('/', controller.obtenerDetalles);
router.get('/pedido/:idPedido', validarParametroNumerico('idPedido'), controller.detallesPorPedido);
router.get('/producto/:idProducto', validarParametroNumerico('idProducto'), controller.detallesPorProducto);
router.get('/:id', validarId, controller.obtenerDetallePorId);
router.post('/', validarDetalle, controller.crearDetalle);
router.put('/:id', validarId, validarDetalle, controller.actualizarDetalle);
router.delete('/:id', validarId, controller.eliminarDetalle);

module.exports = router;
