const pool = require('../db');
const { crearError } = require('../middlewares/errorHandler');

async function obtenerPedidos(req, res, next) {
    try {
        const resultado = await pool.query('SELECT * FROM pedidos ORDER BY id');
        res.json(resultado.rows);
    } catch (error) {
        next(error);
    }
}

async function obtenerPedidoPorId(req, res, next) {
    try {
        const resultado = await pool.query('SELECT * FROM pedidos WHERE id = $1', [req.params.id]);

        if (resultado.rows.length === 0) {
            return next(crearError('Pedido no encontrado', 404));
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        next(error);
    }
}

async function crearPedido(req, res, next) {
    try {
        const { usuario_id, fecha, estado } = req.body;

        const resultado = await pool.query(
            'INSERT INTO pedidos (usuario_id, fecha, estado) VALUES ($1, COALESCE($2, CURRENT_DATE), COALESCE($3, \'pendiente\')) RETURNING *',
            [usuario_id, fecha, estado]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        next(error);
    }
}

async function actualizarPedido(req, res, next) {
    try {
        const { usuario_id, fecha, estado } = req.body;

        const resultado = await pool.query(
            'UPDATE pedidos SET usuario_id = $1, fecha = COALESCE($2, fecha), estado = COALESCE($3, estado) WHERE id = $4 RETURNING *',
            [usuario_id, fecha, estado, req.params.id]
        );

        if (resultado.rows.length === 0) {
            return next(crearError('Pedido no encontrado', 404));
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        next(error);
    }
}

async function eliminarPedido(req, res, next) {
    try {
        const resultado = await pool.query('DELETE FROM pedidos WHERE id = $1 RETURNING *', [req.params.id]);

        if (resultado.rows.length === 0) {
            return next(crearError('Pedido no encontrado', 404));
        }

        res.json({ mensaje: 'Pedido eliminado correctamente' });
    } catch (error) {
        next(error);
    }
}

async function pedidosPorCliente(req, res, next) {
    try {
        const usuario = await pool.query('SELECT id FROM usuarios WHERE id = $1', [req.params.idUsuario]);

        if (usuario.rows.length === 0) {
            return next(crearError('Usuario no encontrado', 404));
        }

        const resultado = await pool.query(
            'SELECT * FROM pedidos WHERE usuario_id = $1 ORDER BY id',
            [req.params.idUsuario]
        );

        res.json(resultado.rows);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    obtenerPedidos,
    obtenerPedidoPorId,
    crearPedido,
    actualizarPedido,
    eliminarPedido,
    pedidosPorCliente
};
