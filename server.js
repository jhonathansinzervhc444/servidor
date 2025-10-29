const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 3000;

const ARQUIVO_DADOS = path.join(__dirname, 'dados.json');

const app = express();

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/mensagens', async (req, res) => {
    try {
        let dadosAtuais = [];

        try {
            const dadosArquivo = await fs.promises.readFile(ARQUIVO_DADOS, 'utf-8');
            dadosAtuais = JSON.parse(dadosArquivo);
        } catch (readError) {
            console.warn('dados.json nao encontrado, retornando lista vazia: ', readError);
        }

        res.status(200).send(dadosAtuais);
    } catch (error) {
        console.error('error ao ler dados: ', error);
        res.send(500).send('error ao ler dados');
    }
});

app.post('/salvar-dados', express.json(), async (req, res) => {
    const novoDado = req.body;

    if(!novoDado) {
        return res.status(500).send('Dados invalidos');
    }

    try {
        let dadosAtuais = [];

        try {
            const dadosArquivo = await fs.promises.readFile(ARQUIVO_DADOS, 'utf-8');
            dadosAtuais = JSON.parse(dadosArquivo);
        } catch (readError) {
            console.warn('Arquivo dados.json não encontrado. Será criado um novo.');
        }

        dadosAtuais.push(novoDado);

        await fs.promises.writeFile(ARQUIVO_DADOS, JSON.stringify(dadosAtuais, null, 2), 'utf-8');
        
        console.log('Dados salvos com sucesso: ', novoDado);
        res.status(200).send('Dados salvos com sucesso');
    } catch (writeError) {
        console.error('Erro ao salvar dados', writeError);
        res.status(500).send('Erro ao salvar dados');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});