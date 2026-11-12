const express = require('express');
const router = express.Router();
const controller = require('../controllers/productosController');
const { validarId, validarProducto, validarParametroNumerico } = require('../middlewares/validaciones');

router.get('/', controller.obtenerProductos);
router.get('/top/:n', validarParametroNumerico('n'), controller.topProductos);
router.get('/:id', validarId, controller.obtenerProductoPorId);
router.post('/', validarProducto, controller.crearProducto);
router.put('/:id', validarId, validarProducto, controller.actualizarProducto);
router.delete('/:id', validarId, controller.eliminarProducto);

module.exports = router;
