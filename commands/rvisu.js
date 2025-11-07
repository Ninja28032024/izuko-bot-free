const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'rvisu',
    aliases: [],
    async execute({ lux, msg, from }) {
        const quotedInfo = msg.message.extendedTextMessage?.contextInfo;
        if (!quotedInfo?.quotedMessage) {
            return await lux.sendMessage(from, { text: 'Mestre, por favor, responda a uma imagem ou vídeo de visualização única.' }, { quoted: msg });
        }
        const quotedMessage = quotedInfo.quotedMessage;
        const mediaType = Object.keys(quotedMessage)[0];
        let mediaMessage = quotedMessage[mediaType];
        
        // Tratar o caso de ViewOnceMessageV2 (estrutura mais recente do Baileys)
        if (mediaType === 'viewOnceMessageV2') {
            mediaMessage = mediaMessage.message[Object.keys(mediaMessage.message)[0]];
        }

        // CORREÇÃO: Verifica se a mediaKey existe antes de tentar o download
        if (!mediaMessage.mediaKey) {
            return await lux.sendMessage(from, { text: '❌ Mestre, não consegui acessar a mídia marcada. A chave de acesso está faltando (mediaKey). Ela pode ter sido apagada ou o link expirou.' }, { quoted: msg });
        }

        if (!mediaMessage || !mediaMessage.viewOnce) {
            return await lux.sendMessage(from, { text: 'Mestre, a mensagem respondida não é de visualização única.' }, { quoted: msg });
        }

        const stream = await downloadContentFromMessage(mediaMessage, mediaType.replace('Message', ''));
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        if (mediaType === 'imageMessage') {
            await lux.sendMessage(from, { image: buffer, caption: "Mestre, imagem revelada!" }, { quoted: msg });
        } else if (mediaType === 'videoMessage') {
            await lux.sendMessage(from, { video: buffer, caption: "Mestre, vídeo revelado!" }, { quoted: msg });
        }
    }
};
