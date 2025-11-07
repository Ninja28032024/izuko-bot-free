// commands/upload-catbox.js
const { downloadContentFromMessage, getContentType, delay } = require('@whiskeysockets/baileys');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Função para fazer o upload para o Catbox.moe
async function uploadToCatbox(buffer) {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('userhash', ''); // O userhash é opcional
    form.append('fileToUpload', buffer, {
        filename: `izuko-upload-${Date.now()}.jpg`, // Nome de arquivo genérico
    });

    try {
        const response = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: {
                ...form.getHeaders( )
            }
        });
        return response.data; // Retorna a URL direta
    } catch (error) {
        // Se a API do Catbox falhar, lança um erro para ser pego pelo comando
        throw new Error(`A comunicação com os servidores do Catbox falhou: ${error.message}`);
    }
}

module.exports = {
    name: 'upload-catbox',
    aliases: ['upload', 'tourl'],
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
            return await lux.sendMessage(from, { text: 'Mestre, para que eu possa imortalizar uma mídia na nuvem, Vossa Senhoria precisa responder a uma imagem ou vídeo com este comando.' }, { quoted: msg });
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
            
            const initialMessage = await lux.sendMessage(from, { text: `Iniciando ritual de ascensão...\n${progressBar[0]}` }, { quoted: msg });
            loadingKey = initialMessage.key;

            // 2. Faz o download da mídia
            const stream = await downloadContentFromMessage(mediaMessage, mediaType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            await lux.sendMessage(from, { text: `Mídia recebida. Forjando o portal...\n${progressBar[1]}`, edit: loadingKey });

            // 3. Faz o upload para o Catbox.moe
            await delay(500); // Pequeno delay para efeito dramático
            await lux.sendMessage(from, { text: `Enviando para a nuvem etérea...\n${progressBar[2]}`, edit: loadingKey });
            
            const link = await uploadToCatbox(buffer);
            
            await lux.sendMessage(from, { text: `Portal estabilizado. Recebendo o selo...\n${progressBar[3]}`, edit: loadingKey });
            await delay(500);

            // 4. Envia a mensagem final de sucesso
            const finalMessage = `*IMAGEM IMORTALIZADA* 📜\n\nMestre, a mídia foi elevada aos reinos etéreos. Sua essência agora está selada neste pergaminho digital, acessível a todos que o portarem.\n\n*Link Direto:* ${link}`;
            await lux.sendMessage(from, { text: finalMessage, edit: loadingKey });

        } catch (error) {
            console.error("Erro no comando !upload-catbox:", error);
            const errorMessage = `Mestre, o ritual de ascensão falhou. A energia da mídia era instável ou os reinos etéreos estão selados. Tente novamente.\n\n*Motivo:* ${error.message}`;
            
            // Se a barra de progresso foi iniciada, edita a mensagem com o erro.
            // Caso contrário, envia uma nova mensagem de erro.
            if (loadingKey) {
                await lux.sendMessage(from, { text: errorMessage, edit: loadingKey });
            } else {
                await lux.sendMessage(from, { text: errorMessage }, { quoted: msg });
            }
        }
    }
};
