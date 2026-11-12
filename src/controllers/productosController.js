const pool = require('../db');
const { crearError } = require('../middlewares/errorHandler');

async function obtenerProductos(req, res, next) {
    try {
        const resultado = await pool.query('SELECT * FROM productos ORDER BY id');
        res.json(resultado.rows);
    } catch (error) {
        next(error);
    }
}

async function obtenerProductoPorId(req, res, next) {
    try {
        const resultado = await pool.query('SELECT * FROM productos WHERE id = $1', [req.params.id]);

        if (resultado.rows.length === 0) {
            return next(crearError('Producto no encontrado', 404));
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        next(error);
    }
}

async function crearProducto(req, res, next) {
    try {
        const { nombre, precio } = req.body;

        const resultado = await pool.query(
            'INSERT INTO productos (nombre, precio) VALUES ($1, $2) RETURNING *',
            [nombre, precio]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        next(error);
    }
}

async function actualizarProducto(req, res, next) {
    try {
        const { nombre, precio } = req.body;

        const resultado = await pool.query(
            'UPDATE productos SET nombre = $1, precio = $2 WHERE id = $3 RETURNING *',
            [nombre, precio, req.params.id]
        );

        if (resultado.rows.length === 0) {
            return next(crearError('Producto no encontrado', 404));
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        next(error);
    }
}

async function eliminarProducto(req, res, next) {
    try {
        const resultado = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [req.params.id]);

        if (resultado.rows.length === 0) {
            return next(crearError('Producto no encontrado', 404));
        }

        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        next(error);
    }
}

async function topProductos(req, res, next) {
    try {
        const resultado = await pool.query(
            `SELECT p.nombre, SUM(d.cantidad)::int AS total_vendido
             FROM detalles_pedido d
             INNER JOIN productos p ON p.id = d.producto_id
             GROUP BY p.id, p.nombre
             ORDER BY total_vendido DESC
             LIMIT $1`,
            [req.params.n]
        );

        res.json(resultado.rows);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    topProductos
};
