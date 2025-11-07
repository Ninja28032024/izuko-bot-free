// commands/upload-drive.js
const { google } = require('googleapis');
const { downloadContentFromMessage, getContentType } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Caminhos para os arquivos de credenciais e token
const CREDENTIALS_PATH = path.join(__dirname, '..', 'credentials.json');
const TOKEN_PATH = path.join(__dirname, '..', 'banco de dados', 'token_drive.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// =================================================================
// == ID DA PASTA NO GOOGLE DRIVE ONDE OS ARQUIVOS SERÃO SALVOS.
// =================================================================
// Crie uma pasta no seu Google Drive e cole o ID dela aqui.
// O ID fica na URL: https://drive.google.com/drive/folders/AQUI_FICA_O_ID_DA_PASTA
const DRIVE_FOLDER_ID = '1BeTVZ43nhPZhrPzI4pv1Vcj7MEQnVE4F';
// =================================================================


/**
 * Carrega as credenciais do cliente a partir de um arquivo local.
 * @returns {Promise<google.auth.OAuth2|null>}
 */
async function loadSavedCredentialsIfExist( ) {
    try {
        if (!fs.existsSync(TOKEN_PATH)) return null;
        const content = fs.readFileSync(TOKEN_PATH, 'utf-8');
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        console.error('Erro ao carregar o token do Drive:', err);
        return null;
    }
}

/**
 * Serializa as credenciais para um arquivo para uso futuro.
 * @param {google.auth.OAuth2} client
 */
async function saveCredentials(client) {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
        throw new Error(`Arquivo de credenciais não encontrado em: ${CREDENTIALS_PATH}`);
    }
    const content = fs.readFileSync(CREDENTIALS_PATH, 'utf-8');
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    fs.writeFileSync(TOKEN_PATH, payload);
}

/**
 * Lida com o fluxo de autorização interativo.
 * @param {google.auth.OAuth2} oAuth2Client
 */
async function getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log('================================================================================');
    console.log('|| AUTORIZAÇÃO DO GOOGLE DRIVE NECESSÁRIA (APENAS UMA VEZ)                     ||');
    console.log('================================================================================');
    console.log('1. Copie e cole a seguinte URL no seu navegador:');
    console.log(authUrl);
    console.log('\n2. Faça login, autorize o acesso e a página lhe dará um código.');
    console.log('3. Cole o código aqui no terminal e pressione Enter.');
    console.log('================================================================================');

    // Esta parte é interativa e deve ser executada no terminal local, não no servidor do bot.
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const code = await new Promise(resolve => rl.question('>> Digite o código da página aqui: ', resolve));
    rl.close();

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    await saveCredentials(oAuth2Client);
    console.log('Token salvo com sucesso em', TOKEN_PATH);
    return oAuth2Client;
}

/**
 * Cria um cliente OAuth2 autorizado.
 */
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    
    if (!fs.existsSync(CREDENTIALS_PATH)) {
        throw new Error(`O arquivo credentials.json não foi encontrado. Por favor, siga os passos da Fase 1 para criá-lo e colocá-lo na pasta raiz do bot.`);
    }

    const content = fs.readFileSync(CREDENTIALS_PATH, 'utf-8');
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const oAuth2Client = new google.auth.OAuth2(key.client_id, key.client_secret, key.redirect_uris[0]);
    
    // Se o token não existe, o processo de autorização interativo deve ser iniciado.
    // Isso não deve acontecer durante a execução normal do bot, apenas na configuração inicial.
    throw new Error('O arquivo token_drive.json não foi encontrado. Execute o ritual de autorização da Fase 3 para criá-lo.');
}

/**
 * Faz o upload do arquivo para o Google Drive e retorna o link.
 * @param {Buffer} buffer
 * @param {string} mediaType
 * @param {google.auth.OAuth2} authClient
 */
async function uploadToDrive(buffer, mediaType, authClient) {
    const drive = google.drive({ version: 'v3', auth: authClient });
    const fileMetadata = {
        name: `izuko-upload-${Date.now()}.${mediaType === 'video' ? 'mp4' : 'jpg'}`,
        parents: [DRIVE_FOLDER_ID],
    };
    const media = {
        mimeType: mediaType === 'video' ? 'video/mp4' : 'image/jpeg',
        body: require('stream').Readable.from(buffer),
    };

    const file = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, webViewLink',
    });

    // Torna o arquivo público para que o link funcione
    await drive.permissions.create({
        fileId: file.data.id,
        requestBody: {
            role: 'reader',
            type: 'anyone',
        },
    });

    return file.data.webViewLink;
}

module.exports = {
    name: 'upload-drive',
    aliases: ['gdrive', 'uploadg'],
    execute: async ({ lux, from, msg }) => {
        if (DRIVE_FOLDER_ID === 'ID_DA_SUA_PASTA_AQUI') {
            return await lux.sendMessage(from, { text: 'Mestre, o comando `upload-drive` precisa ser configurado com o ID da pasta do Google Drive no arquivo do comando.' }, { quoted: msg });
        }

        let mediaMessage;
        let mediaType;

        const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
        if (quoted) {
            const contentType = getContentType(quoted);
            if (contentType === 'imageMessage' || contentType === 'videoMessage') {
                mediaMessage = quoted[contentType];
                mediaType = contentType.replace('Message', '');
            }
        }

        if (!mediaMessage) {
            return await lux.sendMessage(from, { text: 'Mestre, para usar o portal do Google Drive, responda a uma imagem ou vídeo.' }, { quoted: msg });
        }

        try {
            await lux.sendMessage(from, { text: 'Iniciando ritual de ascensão para o Google Drive... Autenticando...' }, { quoted: msg });

            const authClient = await authorize();
            
            const stream = await downloadContentFromMessage(mediaMessage, mediaType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) { buffer = Buffer.concat([buffer, chunk]); }

            await lux.sendMessage(from, { text: 'Autenticado. Enviando para sua fortaleza no Google Drive...' }, { quoted: msg });

            const link = await uploadToDrive(buffer, mediaType, authClient);

            const finalMessage = `*MÍDIA IMORTALIZADA (GOOGLE DRIVE)* 🏰\n\nMestre, a mídia foi selada com sucesso em sua fortaleza no Google Drive.\n\n*Link de Acesso:* ${link}`;
            await lux.sendMessage(from, { text: finalMessage }, { quoted: msg });

        } catch (error) {
            console.error("Erro no comando !upload-drive:", error);
            await lux.sendMessage(from, { text: `Mestre, o ritual de ascensão ao Google Drive falhou.\n\n*Motivo:* ${error.message}` }, { quoted: msg });
        }
    }
};
