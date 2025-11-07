// Salvar como: commands/fotomenu.js

const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { uploadToCatbox } = require('../settings/lib/upload.js');

const dbPath = path.join(__dirname, '..', 'banco de dados', 'menu_images.json');

/**
 * Lê o arquivo JSON que armazena as URLs das imagens do menu.
 * @returns {string[]} Um array de URLs.
 */
function lerMenuImagesDB() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify([]));
        return [];
    }
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

/**
 * Salva o array de URLs de volta no arquivo JSON.
 * @param {string[]} data O array de URLs a ser salvo.
 */
function salvarMenuImagesDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = {
    name: 'fotomenu',
    aliases: ['addfotomenu'],
    isOwner: true, // ENCANTAMENTO DE RESTRIÇÃO: Apenas o Mestre pode usar.

    execute: async ({ lux, from, msg, isOwner }) => {
        // Verificação dupla de segurança, embora o main.js já bloqueie o acesso.
        if (!isOwner) {
            return await lux.sendMessage(from, { text: 'Mestre, este é um jutsu proibido. Apenas o grande Mestre pode invocá-lo.' }, { quoted: msg });
        }

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted || !quoted.imageMessage) {
            return await lux.sendMessage(from, { text: 'Mestre, para este jutsu funcionar, Vossa Senhoria deve marcar a imagem que deseja consagrar ao menu.' }, { quoted: msg });
        }

        await lux.sendMessage(from, { text: '🌀 *Absorvendo a imagem...*\nEstou iniciando o ritual para forjar o novo link de poder. Aguarde, Mestre.' }, { quoted: msg });

        try {
            // Passo 1: Fazer o download da imagem marcada
            const stream = await downloadContentFromMessage(quoted.imageMessage, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            // Passo 2: Fazer o upload para o Catbox usando o jutsu auxiliar
            const imageUrl = await uploadToCatbox(buffer);

            // Passo 3: Atualizar o cofre de memórias (banco de dados)
            const menuImages = lerMenuImagesDB();
            if (menuImages.includes(imageUrl)) {
                return await lux.sendMessage(from, { text: '📜 *Pergaminho Duplicado.*\nMestre, esta imagem já foi consagrada e reside em meu cofre de memórias.' }, { quoted: msg });
            }

            menuImages.push(imageUrl);
            salvarMenuImagesDB(menuImages);

            // Passo 4: Enviar a mensagem de confirmação
            const resposta = `✅ *IMAGEM CONSAGRADA!*\n\nMestre, a imagem foi absorvida com sucesso, transformada em um link de poder e adicionada ao meu cofre de memórias do menu.`;
            await lux.sendMessage(from, { text: resposta }, { quoted: msg });

        } catch (error) {
            console.error("[fotomenu] Erro no ritual de absorção:", error);
            await lux.sendMessage(from, { text: `❌ *FALHA NO RITUAL.*\nMestre, houve uma interferência sombria. Não foi possível consagrar a imagem. Detalhes do erro: ${error.message}` }, { quoted: msg });
        }
    }
};
