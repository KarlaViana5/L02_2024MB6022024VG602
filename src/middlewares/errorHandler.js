function crearError(mensaje, estado) {
    const error = new Error(mensaje);
    error.estado = estado;
    return error;
}

function rutaNoEncontrada(req, res, next) {
    next(crearError('Ruta no encontrada', 404));
}

function manejarErrores(err, req, res, next) {
    console.log(err.message);

    if (err.estado) {
        return res.status(err.estado).json({ error: err.message });
    }

    if (err.code === '23505') {
        return res.status(409).json({ error: 'Ya existe un registro con ese valor' });
    }

    if (err.code === '23503') {
        return res.status(400).json({ error: 'El registro esta relacionado con otro que no existe o que depende de el' });
    }

    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'El JSON enviado no es valido' });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = { crearError, rutaNoEncontrada, manejarErrores };
