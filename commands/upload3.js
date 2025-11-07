// commands/upload3.js
const { downloadContentFromMessage, getContentType, delay } = require('@whiskeysockets/baileys');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Função para fazer o upload para o telegra.ph
async function uploadToTelegraph(buffer) {
    const form = new FormData();
    // O telegra.ph espera o arquivo em um campo com nome arbitrário, mas 'file' é um bom padrão.
    form.append('file', buffer, {
        filename: `izuko-upload-${Date.now()}.jpg`, // O nome do arquivo é importante aqui
        contentType: 'image/jpeg', // O tipo de conteúdo também pode ajudar
    });

    try {
        // A URL de upload do Telegraph
        const apiUrl = 'https://telegra.ph/upload';
        
        const response = await axios.post(apiUrl, form, {
            headers: {
                ...form.getHeaders( ),
            },
        });

        // A resposta é um array com um objeto contendo o caminho do arquivo
        if (Array.isArray(response.data) && response.data[0] && response.data[0].src) {
            // Montamos a URL completa
            return `https://telegra.ph${response.data[0].src}`;
        } else {
            throw new Error('A API do Telegraph não retornou um caminho de arquivo válido.' );
        }
    } catch (error) {
        const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
        throw new Error(`A comunicação com os servidores do Telegraph falhou: ${errorMessage}`);
    }
}

module.exports = {
    name: 'upload3',
    aliases: ['telegraph'], // Adicionei um alias útil
    execute: async ({ lux, from, msg }) => {
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
            return await lux.sendMessage(from, { text: 'Mestre, para que eu possa usar o portal Telegraph, Vossa Senhoria precisa responder a uma imagem ou vídeo com este comando.' }, { quoted: msg });
        }

        let loadingKey;

        try {
            const progressBar = ['[■□□□□] 20%', '[■■□□□] 40%', '[■■■□□] 60%', '[■■■■□] 80%', '[■■■■■] 100%'];
            const initialMessage = await lux.sendMessage(from, { text: `Iniciando ritual de ascensão para o portal Telegraph...\n${progressBar[0]}` }, { quoted: msg });
            loadingKey = initialMessage.key;

            const stream = await downloadContentFromMessage(mediaMessage, mediaType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) { buffer = Buffer.concat([buffer, chunk]); }
            await lux.sendMessage(from, { text: `Mídia recebida. Conectando ao Telegraph...\n${progressBar[1]}`, edit: loadingKey });

            await delay(500);
            await lux.sendMessage(from, { text: `Enviando para o domínio Telegraph...\n${progressBar[2]}`, edit: loadingKey });
            
            const link = await uploadToTelegraph(buffer);
            
            await lux.sendMessage(from, { text: `Portal estabilizado. Recebendo o selo digital...\n${progressBar[3]}`, edit: loadingKey });
            await delay(500);

            const finalMessage = `*MÍDIA IMORTALIZADA (TELEGRAPH)* 📜\n\nMestre, a mídia foi elevada com sucesso através do portal Telegraph.\n\n*Link Direto:* ${link}`;
            await lux.sendMessage(from, { text: finalMessage, edit: loadingKey });

        } catch (error) {
            console.error("Erro no comando !upload3:", error);
            const errorMessage = `Mestre, o ritual de ascensão falhou. A energia da mídia era instável ou o portal Telegraph está selado.\n\n*Motivo:* ${error.message}`;
            
            if (loadingKey) {
                await lux.sendMessage(from, { text: errorMessage, edit: loadingKey });
            } else {
                await lux.sendMessage(from, { text: errorMessage }, { quoted: msg });
            }
        }
    }
};
