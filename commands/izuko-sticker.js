// Salvar como: commands/izuko-sticker.js
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { createExif } = require('../settings/lib/exif.js'); // Importa o mestre dos selos

const getRandom = (ext) => `${Math.floor(Math.random() * 10000)}${ext}`;

module.exports = {
    name: 'izuko-sticker',
    aliases: ['izuko-s', 'izuko-f'],

    execute: async ({ lux, msg, from, args }) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const isImage = quoted?.imageMessage;
        const isVideo = quoted?.videoMessage && quoted.videoMessage.seconds <= 10;

        if (!isImage && !isVideo) {
            return await lux.sendMessage(from, { text: 'Mestre, para forjar uma figurinha, marque uma imagem ou um vídeo de até 10 segundos.' }, { quoted: msg });
        }

        await lux.sendMessage(from, { text: 'Recebi a ordem. Iniciando o ritual de forja da figurinha...' }, { quoted: msg });

        const mediaPath = path.join(__dirname, '..', 'temp', getRandom(isImage ? '.jpg' : '.mp4'));
        const stickerPath = path.join(__dirname, '..', 'temp', getRandom('.webp'));

        try {
            const stream = await downloadContentFromMessage(isImage ? quoted.imageMessage : quoted.videoMessage, isImage ? 'image' : 'video');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            fs.writeFileSync(mediaPath, buffer);

            const ffmpegCommand = `ffmpeg -i ${mediaPath} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${stickerPath}`;
            
            exec(ffmpegCommand, async (error) => {
                fs.unlinkSync(mediaPath); // Limpa o arquivo de mídia original

                if (error) {
                    console.error("Erro no ffmpeg:", error);
                    return await lux.sendMessage(from, { text: 'Mestre, uma anomalia no fluxo de chakra impediu a forja da figurinha.' }, { quoted: msg });
                }

                try {
                    // 1. Cria o selo padrão do clã
                    const exif = createExif('Clã Izuko', 'By Mestre');
                    const stickerBuffer = fs.readFileSync(stickerPath);

                    // 2. Envia a figurinha e o selo em um único encantamento
                    await lux.sendMessage(from, { 
                        sticker: stickerBuffer,
                        packname: 'Clã Izuko',
                        author: 'By Mestre'
                     }, { quoted: msg, pack: 'Clã Izuko', author: 'By Mestre', exif: exif });

                } catch (sendError) {
                    console.error("Erro ao enviar sticker:", sendError);
                    await lux.sendMessage(from, { text: `A figurinha foi forjada, mas houve um erro ao enviá-la: ${sendError.message}` }, { quoted: msg });
                } finally {
                    if (fs.existsSync(stickerPath)) fs.unlinkSync(stickerPath); // Limpeza final
                }
            });

        } catch (error) {
            console.error("Erro no jutsu 'izuko-sticker':", error);
            await lux.sendMessage(from, { text: `Mestre, o ritual de forja falhou: ${error.message}` }, { quoted: msg });
        }
    }
};
