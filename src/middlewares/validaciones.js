const { crearError } = require('./errorHandler');

function esNumeroPositivo(valor) {
    return Number.isInteger(Number(valor)) && Number(valor) > 0;
}

function vacio(valor) {
    return valor === undefined || valor === null || String(valor).trim() === '';
}

function validarId(req, res, next) {
    if (!esNumeroPositivo(req.params.id)) {
        return next(crearError('El id debe ser un numero entero mayor a 0', 400));
    }
    next();
}

function validarParametroNumerico(nombreParametro) {
    return function (req, res, next) {
        if (!esNumeroPositivo(req.params[nombreParametro])) {
            return next(crearError('El parametro ' + nombreParametro + ' debe ser un numero entero mayor a 0', 400));
        }
        next();
    };
}

function validarUsuario(req, res, next) {
    const { nombre, apellido, correo } = req.body;

    if (vacio(nombre) || vacio(apellido) || vacio(correo)) {
        return next(crearError('nombre, apellido y correo son obligatorios', 400));
    }

    if (!String(correo).includes('@') || !String(correo).includes('.')) {
        return next(crearError('El correo no tiene un formato valido', 400));
    }

    next();
}

function validarProducto(req, res, next) {
    const { nombre, precio } = req.body;

    if (vacio(nombre) || vacio(precio)) {
        return next(crearError('nombre y precio son obligatorios', 400));
    }

    if (isNaN(precio) || Number(precio) <= 0) {
        return next(crearError('El precio debe ser un numero mayor a 0', 400));
    }

    next();
}

function validarPedido(req, res, next) {
    const { usuario_id } = req.body;

    if (!esNumeroPositivo(usuario_id)) {
        return next(crearError('usuario_id es obligatorio y debe ser un numero entero mayor a 0', 400));
    }

    next();
}

function validarDetalle(req, res, next) {
    const { pedido_id, producto_id, cantidad, precio_unitario } = req.body;

    if (!esNumeroPositivo(pedido_id) || !esNumeroPositivo(producto_id)) {
        return next(crearError('pedido_id y producto_id son obligatorios y deben ser numeros enteros mayores a 0', 400));
    }

    if (!esNumeroPositivo(cantidad)) {
        return next(crearError('La cantidad debe ser un numero entero mayor a 0', 400));
    }

    if (vacio(precio_unitario) || isNaN(precio_unitario) || Number(precio_unitario) <= 0) {
        return next(crearError('El precio_unitario debe ser un numero mayor a 0', 400));
    }

    next();
}

module.exports = {
    validarId,
    validarParametroNumerico,
    validarUsuario,
    validarProducto,
    validarPedido,
    validarDetalle
};
