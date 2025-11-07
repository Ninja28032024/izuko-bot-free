// commands/upload2.js
const { downloadContentFromMessage, getContentType, delay } = require('@whiskeysockets/baileys');
const axios = require('axios');
const FormData = require('form-data');

// Função para fazer o upload para a API do Postimage
async function uploadToPostimage(buffer) {
    const form = new FormData();
    // A API do Postimage espera o arquivo no campo 'file'
    form.append('file', buffer, {
        filename: `izuko-upload-${Date.now()}.jpg`, // Nome de arquivo genérico
    });

    try {
        // A URL da API é diferente da URL de upload do site
        const apiUrl = 'https://api.postimages.org/1/upload';
        
        const response = await axios.post(apiUrl, form, {
            headers: {
                ...form.getHeaders( ),
            },
        });

        // Verifica se o upload foi bem-sucedido e retorna o link direto
        if (response.data && response.data.status === 'OK' && response.data.url) {
            return response.data.url;
        } else {
            // Se a API retornar um erro, nós o repassamos
            throw new Error(response.data.message || 'A API do Postimage não retornou um link válido.');
        }
    } catch (error) {
        // Se a requisição falhar, lança um erro para ser pego pelo comando
        const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
        throw new Error(`A comunicação com os servidores do Postimage falhou: ${errorMessage}`);
    }
}

module.exports = {
    name: 'upload2',
    aliases: [], // Sem aliases, conforme ordenado
    execute: async ({ lux, from, msg }) => {
        let mediaMessage;
        let mediaType;

        // Verifica se a mensagem é uma resposta a uma mídia
        const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
        if (quoted) {
            const contentType = getContentType(quoted);
            if (contentType === 'imageMessage' || contentType === 'videoMessage') {
                mediaMessage = quoted[contentType];
                mediaType = contentType.replace('Message', '');
            }
        }

        if (!mediaMessage) {
            return await lux.sendMessage(from, { text: 'Mestre, para que eu possa imortalizar uma mídia neste novo portal, Vossa Senhoria precisa responder a uma imagem ou vídeo com este comando.' }, { quoted: msg });
        }

        let loadingKey;

        try {
            // 1. Inicia a barra de progresso
            const progressBar = [
                '[■□□□□] 20%',
                '[■■□□□] 40%',
                '[■■■□□] 60%',
                '[■■■■□] 80%',
                '[■■■■■] 100%',
            ];
            
            const initialMessage = await lux.sendMessage(from, { text: `Iniciando ritual de ascensão para o novo portal...\n${progressBar[0]}` }, { quoted: msg });
            loadingKey = initialMessage.key;

            // 2. Faz o download da mídia
            const stream = await downloadContentFromMessage(mediaMessage, mediaType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            await lux.sendMessage(from, { text: `Mídia recebida. Forjando a conexão...\n${progressBar[1]}`, edit: loadingKey });

            // 3. Faz o upload para o Postimage
            await delay(500);
            await lux.sendMessage(from, { text: `Enviando para o domínio Postimage...\n${progressBar[2]}`, edit: loadingKey });
            
            const link = await uploadToPostimage(buffer);
            
            await lux.sendMessage(from, { text: `Portal estabilizado. Recebendo o selo digital...\n${progressBar[3]}`, edit: loadingKey });
            await delay(500);

            // 4. Envia a mensagem final de sucesso
            const finalMessage = `*MÍDIA IMORTALIZADA (PORTAL 2)* 📜\n\nMestre, a mídia foi elevada com sucesso através do portal Postimage.\n\n*Link Direto:* ${link}`;
            await lux.sendMessage(from, { text: finalMessage, edit: loadingKey });

        } catch (error) {
            console.error("Erro no comando !upload2:", error);
            const errorMessage = `Mestre, o ritual de ascensão falhou. A energia da mídia era instável ou o portal Postimage está selado.\n\n*Motivo:* ${error.message}`;
            
            if (loadingKey) {
                await lux.sendMessage(from, { text: errorMessage, edit: loadingKey });
            } else {
                await lux.sendMessage(from, { text: errorMessage }, { quoted: msg });
            }
        }
    }
};
