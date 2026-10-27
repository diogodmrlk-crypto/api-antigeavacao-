const express = require('express');
const app = express();

app.use(express.json({ limit: '10mb' }));

let framesNaMemoria = [];
const API_KEY = "purpou123";

app.post('/api/gravacao', (req, res) => {
    if (req.headers.authorization !== API_KEY) {
        return res.status(403).json({ error: 'Senha invalida' });
    }

    const { imagemBase64 } = req.body;
    if (imagemBase64) {
        framesNaMemoria.push(imagemBase64);
        if (framesNaMemoria.length > 50) framesNaMemoria.shift();
    }
    return res.status(200).json({ ok: true, total: framesNaMemoria.length });
});

app.get('/api/gravacao', (req, res) => {
    return res.status(200).json({ frames: framesNaMemoria });
});

module.exports = app;
