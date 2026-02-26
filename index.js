const express = require('express');
const connection = require('./bd');

const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
app.use(express.json());

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + '_' + file.originalname)
    }
});

const upload = multer({ storage: storage });

app.post('/clientes', (req, res) => {
    const {nombre, email, telefono, ciudad} = req.body;

    const sql = `INSERT INTO clientes (nombre, email, telefono, ciudad) VALUES(?,?,?,?)`;

    connection.query(sql, [nombre, email, telefono,ciudad], (err, result) =>{
        if (err) {
            return res.status(500).json({error: 'Error al insertar el cliente'});
        }

        res.json({
            mensaje: 'Cliente creado',
            id: result.insertId
        })
    });
});


app.post('/upload-clientes', upload.single('archivo'), (req, res) => {

    const resultados = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
            resultados.push(data);
        })
        .on('end', () => {

            resultados.forEach(cliente => {

                const sql = `
                    INSERT INTO clientes (nombre, email, telefono, ciudad) 
                    VALUES (?, ?, ?, ?)
                `;

                connection.query(sql, [
                    cliente.nombre,
                    cliente.email,
                    cliente.telefono,
                    cliente.ciudad
                ], (err) => {
                    if (err) {
                        console.error("Error insertando:", err);
                    }
                });

            });

            res.json({ mensaje: 'Clientes insertados correctamente' });
        });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});