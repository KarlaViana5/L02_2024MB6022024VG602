require('dotenv').config();
const express = require('express');

const usuariosRoutes = require('./routes/usuariosRoutes');
const productosRoutes = require('./routes/productosRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');
const detallesRoutes = require('./routes/detallesRoutes');
const { rutaNoEncontrada, manejarErrores } = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/detalles', detallesRoutes);

app.use(rutaNoEncontrada);
app.use(manejarErrores);

const puerto = process.env.PORT || 3000;

app.listen(puerto, () => {
    console.log('Servidor corriendo en el puerto ' + puerto);
});
