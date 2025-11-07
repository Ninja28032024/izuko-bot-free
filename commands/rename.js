// Salvar como: commands/rename.js
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { createExif } = require('../settings/lib/exif.js'); // NOVO: Importa o novo mestre dos selos

module.exports = {
    name: 'rename',
    execute: async ({ lux, msg, from, args }) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted || !quoted.stickerMessage) {
            return await lux.sendMessage(from, { text: 'Mestre, este jutsu só pode ser usado em resposta a uma figurinha.' }, { quoted: msg });
        }

        const [packname, author] = args.join(' ').split('|');
        if (!packname || !author) {
            return await lux.sendMessage(from, { text: 'Sintaxe incorreta.\n*Uso:* `rename <nome do pacote>|<nome do autor>`' }, { quoted: msg });
        }

        await lux.sendMessage(from, { text: 'Recebi a ordem. Reforjando o selo da figurinha...' }, { quoted: msg });

        try {
            const stream = await downloadContentFromMessage(quoted.stickerMessage, 'sticker');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            // 1. Cria o selo (Buffer) usando o novo exif.js
            const exif = createExif(packname, author);

            // 2. Envia a figurinha e o selo em um único encantamento
            await lux.sendMessage(from, { 
                sticker: buffer,
                packname: packname.trim(), // Adicionado para consistência
                author: author.trim()      // Adicionado para consistência
            }, { quoted: msg, pack: packname.trim(), author: author.trim(), exif: exif });

        } catch (error) {
            console.error("Erro no jutsu 'rename':", error);
            await lux.sendMessage(from, { text: `Mestre, o ritual de renomeação falhou: ${error.message}` }, { quoted: msg });
        }
    }
};
