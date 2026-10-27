// api.js
const express = require('express');
const app = express();

app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    next();
});

let framesNaMemoria = [];
const API_KEY = "purpou123";

// Aceita POST em QUALQUER rota
app.post('*', (req, res) => {
    if (req.headers.authorization !== API_KEY) {
        return res.status(403).json({ error: 'Senha invalida' });
    }
    const { imagemBase64 } = req.body;
    if (imagemBase64) {
        framesNaMemoria.push(imagemBase64);
        if (framesNaMemoria.length > 50) framesNaMemoria.shift();
        console.log(`[Vercel] Frame recebido. Total: ${framesNaMemoria.length}`);
    }
    return res.status(200).json({ ok: true, total: framesNaMemoria.length });
});

// Aceita GET em QUALQUER rota
app.get('*', (req, res) => {
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
        return res.sendFile(__dirname + '/index.html');
    }
    return res.status(200).json({ frames: framesNaMemoria });
});

module.exports = app;
