// commands/figurinhas.js
const { downloadContentFromMessage, getContentType, delay } = require('@whiskeysockets/baileys');
const sharp = require('sharp');
const { Image } = require('node-webpmux');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Função para inscrever metadados (EXIF) usando a biblioteca node-webpmux
async function writeExif(webpBuffer, metadata) {
    const img = new Image();
    await img.load(webpBuffer);
    const json = { "sticker-pack-id": "izuko-bot-by-lucky", "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author };
    const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
    const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
    const exif = Buffer.concat([exifAttr, jsonBuff]);
    exif.writeUIntLE(jsonBuff.length, 14, 4);
    img.exif = exif;
    return await img.save(null);
}

module.exports = {
    name: 'sticker',
    aliases: ['s', 'f', 'figura', 'stk'],
    execute: async ({ lux, from, msg, settings }) => {
        try {
            let messageMedia;
            let mediaType = '';
            if (getContentType(msg.message) === 'imageMessage') mediaType = 'image', messageMedia = msg.message.imageMessage;
            else if (getContentType(msg.message) === 'videoMessage') mediaType = 'video', messageMedia = msg.message.videoMessage;
            else if (msg.message.extendedTextMessage?.contextInfo?.quotedMessage) {
                const quoted = msg.message.extendedTextMessage.contextInfo.quotedMessage;
                if (getContentType(quoted) === 'imageMessage') mediaType = 'image', messageMedia = quoted.imageMessage;
                else if (getContentType(quoted) === 'videoMessage') mediaType = 'video', messageMedia = quoted.videoMessage;
            }

            if (!mediaType) return await lux.sendMessage(from, { text: 'Mestre, por favor, envie ou responda a uma imagem ou vídeo.' }, { quoted: msg });
            if (mediaType === 'video' && messageMedia.seconds > 9.9) return await lux.sendMessage(from, { text: 'Mestre, o vídeo é muito longo (máx 9.9s).' }, { quoted: msg });

            const loadingMessages = ["[ █ 20% ]", "[ ██ 40% ]", "[ ███ 60% ]", "[ ████ 80% ]", "[ █████ 100% ]"];
            const { key } = await lux.sendMessage(from, { text: `Iniciando o ritual de forja...\n` + loadingMessages[0] }, { quoted: msg });
            for (let i = 1; i < loadingMessages.length; i++) {
                await delay(500);
                await lux.sendMessage(from, { text: `Iniciando o ritual de forja...\n` + loadingMessages[i], edit: key });
            }
            await lux.sendMessage(from, { text: `Forja concluída! Inscrevendo os selos...`, edit: key });

            // =================================================================
            // == CORREÇÃO DO ERRO DE DIGITAÇÃO APLICADA AQUI
            // =================================================================
            // A variável correta é 'messageMedia', não 'mediaMedia'
            const stream = await downloadContentFromMessage(messageMedia, mediaType);
            // =================================================================
            
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

            const metadata = { packname: "Criado por", author: `${settings.nomeBot || 'Izuko BOT'} ${settings.versao || 'V1'}` };
            let stickerBuffer;

            try {
                let webpBuffer;
                if (mediaType === 'video') {
                    webpBuffer = await sharp(buffer, { animated: true }).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 80, loop: 0 }).toBuffer();
                } else {
                    webpBuffer = await sharp(buffer).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 80 }).toBuffer();
                }
                stickerBuffer = await writeExif(webpBuffer, metadata);

            } catch (error) {
                if (mediaType === 'video' && error.message.includes('unsupported')) {
                    await lux.sendMessage(from, { text: 'Mestre, a animação desta mídia é instável. Forjando uma versão estática como alternativa.' }, { quoted: msg });
                    const tempDir = path.join(__dirname, '..', 'node_cache');
                    fs.mkdirSync(tempDir, { recursive: true });
                    const timestamp = Date.now();
                    const inputFile = path.join(tempDir, `${timestamp}_input`);
                    const outputFile = path.join(tempDir, `${timestamp}_output.webp`);
                    fs.writeFileSync(inputFile, buffer);
                    const ffmpegCommand = `ffmpeg -i ${inputFile} -vframes 1 -an -s 512:512 -vcodec libwebp ${outputFile}`;
                    const webpBuffer = await new Promise((resolve, reject) => {
                        exec(ffmpegCommand, (err) => {
                            fs.unlinkSync(inputFile);
                            if (err) return reject(new Error("FFmpeg (Plano B) falhou."));
                            const resultBuffer = fs.readFileSync(outputFile);
                            fs.unlinkSync(outputFile);
                            resolve(resultBuffer);
                        });
                    });
                    stickerBuffer = await writeExif(webpBuffer, metadata);
                } else {
                    throw error;
                }
            }
            await lux.sendMessage(from, { sticker: stickerBuffer }, { quoted: msg });
        } catch (error) {
            console.error("Erro final e definitivo ao criar a figurinha:", error);
            await lux.sendMessage(from, { text: '❌ Mestre, o ritual de forja falhou em todas as tentativas. A energia desta mídia é verdadeiramente caótica.' }, { quoted: msg });
        }
    }
};