const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuariosController');
const { validarId, validarUsuario } = require('../middlewares/validaciones');

router.get('/', controller.obtenerUsuarios);
router.get('/nombre/:nombre', controller.buscarPorNombre);
router.get('/apellido/:apellido', controller.buscarPorApellido);
router.get('/correo/:correo', controller.buscarPorCorreo);
router.get('/:id', validarId, controller.obtenerUsuarioPorId);
router.post('/', validarUsuario, controller.crearUsuario);
router.put('/:id', validarId, validarUsuario, controller.actualizarUsuario);
router.delete('/:id', validarId, controller.eliminarUsuario);

module.exports = router;
