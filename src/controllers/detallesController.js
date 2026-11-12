const pool = require('../db');
const { crearError } = require('../middlewares/errorHandler');

async function obtenerDetalles(req, res, next) {
    try {
        const resultado = await pool.query('SELECT * FROM detalles_pedido ORDER BY id');
        res.json(resultado.rows);
    } catch (error) {
        next(error);
    }
}

async function obtenerDetallePorId(req, res, next) {
    try {
        const resultado = await pool.query('SELECT * FROM detalles_pedido WHERE id = $1', [req.params.id]);

        if (resultado.rows.length === 0) {
            return next(crearError('Detalle no encontrado', 404));
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        next(error);
    }
}

async function crearDetalle(req, res, next) {
    try {
        const { pedido_id, producto_id, cantidad, precio_unitario } = req.body;

        const resultado = await pool.query(
            'INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4) RETURNING *',
            [pedido_id, producto_id, cantidad, precio_unitario]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        next(error);
    }
}

async function actualizarDetalle(req, res, next) {
    try {
        const { pedido_id, producto_id, cantidad, precio_unitario } = req.body;

        const resultado = await pool.query(
            'UPDATE detalles_pedido SET pedido_id = $1, producto_id = $2, cantidad = $3, precio_unitario = $4 WHERE id = $5 RETURNING *',
            [pedido_id, producto_id, cantidad, precio_unitario, req.params.id]
        );

        if (resultado.rows.length === 0) {
            return next(crearError('Detalle no encontrado', 404));
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        next(error);
    }
}

async function eliminarDetalle(req, res, next) {
    try {
        const resultado = await pool.query('DELETE FROM detalles_pedido WHERE id = $1 RETURNING *', [req.params.id]);

        if (resultado.rows.length === 0) {
            return next(crearError('Detalle no encontrado', 404));
        }

        res.json({ mensaje: 'Detalle eliminado correctamente' });
    } catch (error) {
        next(error);
    }
}

async function detallesPorPedido(req, res, next) {
    try {
        const pedido = await pool.query('SELECT id FROM pedidos WHERE id = $1', [req.params.idPedido]);

        if (pedido.rows.length === 0) {
            return next(crearError('Pedido no encontrado', 404));
        }

        const resultado = await pool.query(
            'SELECT * FROM detalles_pedido WHERE pedido_id = $1 ORDER BY id',
            [req.params.idPedido]
        );

        res.json(resultado.rows);
    } catch (error) {
        next(error);
    }
}

async function detallesPorProducto(req, res, next) {
    try {
        const producto = await pool.query('SELECT id FROM productos WHERE id = $1', [req.params.idProducto]);

        if (producto.rows.length === 0) {
            return next(crearError('Producto no encontrado', 404));
        }

        const resultado = await pool.query(
            'SELECT * FROM detalles_pedido WHERE producto_id = $1 ORDER BY id',
            [req.params.idProducto]
        );

        res.json(resultado.rows);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    obtenerDetalles,
    obtenerDetallePorId,
    crearDetalle,
    actualizarDetalle,
    eliminarDetalle,
    detallesPorPedido,
    detallesPorProducto
};
