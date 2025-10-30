/*const express = require('express');
const path = require('path');
const fs = require('fs');
const {body, validationResult} = require('express-validator');
const cors = require('cors');

const PORT = 3000;

const allowedOrigins = ['http://localhost:3000', 
    "http://127.0.0.1:3000", 
    "http://localhost:3000",
    "http://localhost:3000/salvar-dados",
    "http://localhost:3000/mensagens"];

const app = express();

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1) {
            console.log("adentrei");
            callback(null, true);
        }
    }
}

app.use(cors(corsOptions));

const ARQUIVO_DADOS = path.join(__dirname, 'dados.json');



app.use(express.static(path.join(__dirname)), cors(corsOptions));

app.get('/', cors(corsOptions), (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/mensagens', cors(corsOptions), async (req, res) => {
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

app.post('/salvar-dados', cors(corsOptions), express.json(), body('container-mensagens').escape(), async (req, res) => {
    const erros = validationResult(req);
    if(!erros.isEmpty()) {
        return res.status(400).json({erros: erros.array()});
    }
    
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
*/

const cors = require('cors');
const express = require('express');
const app = express();

const allowedOrigins = ['http://localhost:8080', 'http://localhost:80'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., same-origin requests or non-browser clients)
    if (allowedOrigins.indexOf(origin) !== -1) {
        console.log("entrei?");
      callback(null, true);
    } else {
        console.log("aaaaaaa", origin);
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(8080, () => {
  console.log('Server listening on port 8080');
});