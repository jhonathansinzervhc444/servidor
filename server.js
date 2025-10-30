const express = require('express');
const path = require('path');
const fs = require('fs');
const {body, validationResult} = require('express-validator');
const cors = require('cors');

const PORT = 3000;

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3000/'];

const app = express();

/*
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin)) {
            console.log("adentrei");
            callback(null, true);
        } else {
            console.log("nao adentrei");
            callback(new Error("CORS nao permitido"));
        }
    }
}

app.use(cors(corsOptions));
*/
app.use((req, res, next) => {
    const origin = req.headers.origin?.replace(/^http?:\/\//, '');

    if(!origin) {
        const referer = req.headers.referer;
        const host = req.headers.host;

        
        if(referer && referer.includes(host)) {
            console.log("Conexao sem origin mas referer valido. Permitindo acesso...");
            console.log(referer);
            console.log(host);
            console.log(origin);

            res.setHeader('Acess-Control-Allow-Origin', referer);
            res.setHeader('Acess-Control-Allow-Credentials', 'true');
            next();
        }

        console.log("Conexao sem origin. negando acesso... ", referer);
        return res.status(403).send("Acesso Negado");
    }

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Acess-Control-Allow-Origin', origin);
        res.setHeader('Acess-Control-Allow-Credentials', 'true');

        console.log("entrei aqui?");

        return next();
    }

    console.warn("Solicitacao bloqueada pelo CORS ", origin);

    return res.status(403).send("Acesso Negado");
})



const ARQUIVO_DADOS = path.join(__dirname, 'dados.json');



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

app.post('/salvar-dados', express.json(), body('container-mensagens').escape(), async (req, res) => {
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