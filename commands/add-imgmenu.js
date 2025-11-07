// commands/add-imgmenu.js
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { downloadContentFromMessage, getContentType } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'add-imgmenu',
    aliases: ['addimgmenu'],
    description: 'Adiciona uma imagem marcada ao banco de dados do menu.',
    execute: async ({ lux, from, msg, isOwner, sender }) => {
        // --- SELO DE AUTORIDADE SUPREMA ---
        if (!isOwner) {
            console.log(chalk.red(`[PERMISSÃO NEGADA] O usuário ${sender.split('@')[0]} tentou usar o comando !add-imgmenu.`));
            return lux.sendMessage(from, { text: '🛡️ *ACESSO NEGADO* 🛡️\n\nEste é um jutsu de administração, reservado apenas para o Mestre Supremo.' }, { quoted: msg });
        }

        const type = getContentType(msg.message);
        const isQuotedImage = type === 'extendedTextMessage' && msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.quotedMessage && msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
        
        if (!isQuotedImage) {
            return lux.sendMessage(from, { text: 'Mestre, por favor, *marque* uma imagem para que eu possa adicioná-la ao pergaminho do menu.' }, { quoted: msg });
        }

        const quotedMessage = msg.message.extendedTextMessage.contextInfo.quotedMessage;
        const stream = await downloadContentFromMessage(quotedMessage.imageMessage, 'image');

        // Cria um buffer a partir do stream
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        // Define o caminho para a pasta de imagens do menu
        const menuImgDir = path.join(__dirname, '..', 'banco de dados', 'menu img');
        
        // Garante que a pasta exista
        if (!fs.existsSync(menuImgDir)) {
            fs.mkdirSync(menuImgDir, { recursive: true });
        }

        // Gera um nome de arquivo único (timestamp + extensão)
        const timestamp = Date.now();
        const filename = `${timestamp}.jpeg`; // Assumindo que a imagem é JPEG/PNG e salvando como JPEG
        const savePath = path.join(menuImgDir, filename);

        try {
            // Salva o buffer da imagem no arquivo
            fs.writeFileSync(savePath, buffer);

            await lux.sendMessage(from, { text: `✅ Ordem executada. A nova imagem do menu foi salva como *${filename}* no pergaminho de imagens.` }, { quoted: msg });

        } catch (error) {
            console.error(chalk.red('Erro ao salvar imagem de menu:'), error);
            await lux.sendMessage(from, { text: '❌ Mestre, ocorreu uma falha ao tentar salvar a imagem no banco de dados.' }, { quoted: msg });
        }
    }
};
