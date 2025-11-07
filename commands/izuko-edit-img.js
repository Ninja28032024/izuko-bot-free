// commands/izuko-edit-img.js
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { uploadToCatbox } = require('../settings/lib/upload.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * Converte um stream em um buffer.
 * @param {stream.Readable} stream - O stream a ser convertido.
 * @returns {Promise<Buffer>} O buffer resultante.
 */
const streamToBuffer = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
});

module.exports = {
    name: 'izuko-edit-img',
    aliases: ['editimg', 'iaedit'],
    description: 'Edita uma imagem usando IA com um prompt de texto.',
    usage: '<prompt>',
    cooldown: 15,
    isOwner: false,

    async execute({ lux, msg, from, args, prefix }) {
        const prompt = args.join(' ').trim();
        
        if (!prompt) {
            return lux.sendMessage(from, { text: `❌ Use o comando marcando uma imagem e fornecendo um prompt de edição. Ex: \`${prefix}izuko-edit-img transformar em pixel art\`` }, { quoted: msg });
        }

        // 1. Verificar se a mensagem está respondendo a uma imagem
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        let imageMessage = null;
        let mimeType = '';

        if (quotedMsg) {
            if (quotedMsg.imageMessage) {
                imageMessage = quotedMsg.imageMessage;
                mimeType = imageMessage.mimetype;
            } else if (quotedMsg.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
                // Caso a mensagem marcada seja um texto que marcou uma imagem (cenário complexo, mas possível)
                imageMessage = quotedMsg.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
                mimeType = imageMessage.mimetype;
            }
        }
        
        if (!imageMessage) {
            return lux.sendMessage(from, { text: '❌ Você deve marcar uma imagem para usar este comando.' }, { quoted: msg });
        }
        
        await lux.sendMessage(from, { text: '⏳ Recebido! Baixando imagem e enviando para o Catbox...' }, { quoted: msg });

        try {
            // 2. Baixar a imagem
            const stream = await downloadContentFromMessage(imageMessage, 'image');
            const buffer = await streamToBuffer(stream);
            
            // 3. Fazer upload para o Catbox
            // A função uploadToCatbox recebe o buffer, nome e mimetype
            const filename = `image_${msg.key.id}.${mimeType.split('/')[1] || 'jpg'}`;
            const catboxUrl = await uploadToCatbox(buffer, filename, mimeType);

            if (!catboxUrl) {
                throw new Error('Falha ao fazer upload para o Catbox. URL não retornada.');
            }

            await lux.sendMessage(from, { text: `✅ Upload Catbox concluído. URL: ${catboxUrl}\n\nEnviando para a IA de edição...` }, { quoted: msg });

            // 4. Chamar a API de Edição
            const editoriaApiUrl = 'https://systemzone.store/api/editoria';
            const apiResponse = await axios.get(editoriaApiUrl, {
                params: {
                    url: catboxUrl,
                    q: prompt
                }
            });

            if (apiResponse.data.status && apiResponse.data.imagem) {
                const imageUrl = apiResponse.data.imagem;
                const captionText = apiResponse.data.content || `✅ Imagem editada com o prompt: *${prompt}*`;
                
                // 5. Enviar a imagem editada
                await lux.sendMessage(from, {
                    image: { url: imageUrl },
                    caption: captionText
                }, { quoted: msg });
            } else {
                // Se status for false, usa a mensagem de erro da API
                const erroMsg = apiResponse.data.mensagem || 'Erro desconhecido na API de edição.';
                await lux.sendMessage(from, { text: `❌ Falha na edição da imagem: ${erroMsg}` }, { quoted: msg });
            }

        } catch (error) {
            console.error('Erro no comando izuko-edit-img:', error);
            await lux.sendMessage(from, { text: `❌ Ocorreu um erro ao processar a imagem: ${error.message}` }, { quoted: msg });
        }
    }
};
