const { downloadContentFromMessage, getContentType } = require('@whiskeysockets/baileys');
const sharp = require('sharp');

module.exports = {
    name: 'toimg',
    aliases: [],
    async execute({ lux, msg, from }) {
        const quotedInfo = msg.message.extendedTextMessage?.contextInfo;
        if (!quotedInfo?.quotedMessage || getContentType(quotedInfo.quotedMessage) !== 'stickerMessage') {
            return await lux.sendMessage(from, { text: 'Mestre, por favor, responda a uma figurinha para converter em imagem.' }, { quoted: msg });
        }

        await lux.sendMessage(from, { text: 'Mestre, convertendo figurinha para imagem...' }, { quoted: msg });
        const stickerMessage = quotedInfo.quotedMessage.stickerMessage;
        const stream = await downloadContentFromMessage(stickerMessage, 'sticker');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        const pngBuffer = await sharp(buffer).toFormat('png').toBuffer();
        await lux.sendMessage(from, { image: pngBuffer, caption: 'Mestre, sua figurinha foi convertida para imagem.' }, { quoted: msg });
    }
};
