// commands/add-audiomenu.js
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { downloadContentFromMessage, getContentType } = require('@whiskeysockets/baileys');

// Caminho para a pasta de áudios do menu
const MENU_AUDIO_DIR = path.join(__dirname, '..', 'banco de dados', 'audio menu');

module.exports = {
    name: 'add-audiomenu',
    aliases: ['addaudiomenu'],
    description: 'Adiciona um áudio marcado ao banco de dados do menu.',
    execute: async ({ lux, from, msg, isOwner, sender }) => {
        // --- SELO DE AUTORIDADE SUPREMA ---
        if (!isOwner) {
            console.log(chalk.red(`[PERMISSÃO NEGADA] O usuário ${sender.split('@')[0]} tentou usar o comando !add-audiomenu.`));
            return lux.sendMessage(from, { text: '🛡️ *ACESSO NEGADO* 🛡️\n\nEste é um jutsu de administração, reservado apenas para o Mestre Supremo.' }, { quoted: msg });
        }

        const type = getContentType(msg.message);
        const isQuotedAudio = type === 'extendedTextMessage' && msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.quotedMessage && (msg.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage || msg.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2?.message?.audioMessage);
        const isAudio = type === 'audioMessage';

        if (!isQuotedAudio && !isAudio) {
            return lux.sendMessage(from, { text: 'Mestre, por favor, *marque* o áudio que deseja adicionar ao menu.' }, { quoted: msg });
        }

        const audioMessage = isAudio ? msg.message.audioMessage : msg.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage || msg.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.audioMessage;

        if (!audioMessage) {
            return lux.sendMessage(from, { text: 'Mestre, não consegui identificar o áudio na mensagem marcada.' }, { quoted: msg });
        }

        // 1. Cria a pasta se não existir
        if (!fs.existsSync(MENU_AUDIO_DIR)) {
            fs.mkdirSync(MENU_AUDIO_DIR, { recursive: true });
        }

        // 2. Define o nome do arquivo, forçando a extensão .opus
        const timestamp = Date.now();
        const fileName = `audio-menu-${timestamp}.opus`;
        const filePath = path.join(MENU_AUDIO_DIR, fileName);

        // 3. Download do áudio
        try {
            const stream = await downloadContentFromMessage(audioMessage, 'audio');
            const buffer = [];
            for await (const chunk of stream) {
                buffer.push(chunk);
            }
            const audioBuffer = Buffer.concat(buffer);

            // 4. Salva o arquivo
            fs.writeFileSync(filePath, audioBuffer);

            // 5. Feedback
            return lux.sendMessage(from, { text: `✅ *JUTSU DE ARMAZENAMENTO CONCLUÍDO* ✅\n\nO novo pergaminho de áudio (*${fileName}*) foi selado com sucesso no arsenal do menu. (Salvo como OPUS)` }, { quoted: msg });

        } catch (error) {
            console.error(chalk.red(`[ERRO] Falha ao adicionar áudio ao menu:`), error);
            return lux.sendMessage(from, { text: `❌ *FALHA NO JUTSU* ❌\n\nNão consegui selar o áudio no arsenal. Erro: ${error.message}` }, { quoted: msg });
        }
    }
};
