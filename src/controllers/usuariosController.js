const pool = require('../db');
const { crearError } = require('../middlewares/errorHandler');

async function obtenerUsuarios(req, res, next) {
    try {
        const resultado = await pool.query('SELECT * FROM usuarios ORDER BY id');
        res.json(resultado.rows);
    } catch (error) {
        next(error);
    }
}

async function obtenerUsuarioPorId(req, res, next) {
    try {
        const resultado = await pool.query('SELECT * FROM usuarios WHERE id = $1', [req.params.id]);

        if (resultado.rows.length === 0) {
            return next(crearError('Usuario no encontrado', 404));
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        next(error);
    }
}

async function crearUsuario(req, res, next) {
    try {
        const { nombre, apellido, correo } = req.body;

        const resultado = await pool.query(
            'INSERT INTO usuarios (nombre, apellido, correo) VALUES ($1, $2, $3) RETURNING *',
            [nombre, apellido, correo]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        next(error);
    }
}

async function actualizarUsuario(req, res, next) {
    try {
        const { nombre, apellido, correo } = req.body;

        const resultado = await pool.query(
            'UPDATE usuarios SET nombre = $1, apellido = $2, correo = $3 WHERE id = $4 RETURNING *',
            [nombre, apellido, correo, req.params.id]
        );

        if (resultado.rows.length === 0) {
            return next(crearError('Usuario no encontrado', 404));
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        next(error);
    }
}

async function eliminarUsuario(req, res, next) {
    try {
        const resultado = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [req.params.id]);

        if (resultado.rows.length === 0) {
            return next(crearError('Usuario no encontrado', 404));
        }

        res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        next(error);
    }
}

async function buscarPorNombre(req, res, next) {
    try {
        const resultado = await pool.query(
            'SELECT * FROM usuarios WHERE nombre ILIKE $1 ORDER BY id',
            ['%' + req.params.nombre + '%']
        );
        res.json(resultado.rows);
    } catch (error) {
        next(error);
    }
}

async function buscarPorApellido(req, res, next) {
    try {
        const resultado = await pool.query(
            'SELECT * FROM usuarios WHERE apellido ILIKE $1 ORDER BY id',
            ['%' + req.params.apellido + '%']
        );
        res.json(resultado.rows);
    } catch (error) {
        next(error);
    }
}

async function buscarPorCorreo(req, res, next) {
    try {
        const resultado = await pool.query(
            'SELECT * FROM usuarios WHERE correo ILIKE $1 ORDER BY id',
            ['%' + req.params.correo + '%']
        );
        res.json(resultado.rows);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    buscarPorNombre,
    buscarPorApellido,
    buscarPorCorreo
};
