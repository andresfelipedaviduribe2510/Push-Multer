const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'andres',
    password: 'Andres123!',
    database: 'tienda_relacional'
});

connection.connect((err) => {
    if (err) {
        console.error('Error de conexión: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos con ID: ' + connection.threadId);
});

module.exports = connection;