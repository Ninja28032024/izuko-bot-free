// Salvar como: commands/fotogp.js
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'fotogp',
    // Sem aliases

    execute: async ({ lux, msg, from, isGroup, sender, areJidsSameUser, settings }) => {
        if (!isGroup) return;
        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;
        const botIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, settings.botLid))?.admin;

        if (!senderIsAdmin) return await lux.sendMessage(from, { text: 'Apenas generais podem alterar o estandarte do clã.' }, { quoted: msg });
        if (!botIsAdmin) return await lux.sendMessage(from, { text: 'Não tenho a patente para executar esta alteração.' }, { quoted: msg });

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted || !quoted.imageMessage) {
            return await lux.sendMessage(from, { text: 'General, marque a imagem que deve se tornar o novo estandarte do clã.' }, { quoted: msg });
        }

        try {
            const stream = await downloadContentFromMessage(quoted.imageMessage, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            await lux.updateProfilePicture(from, buffer);
            await lux.sendMessage(from, { text: '🖼️ *ESTANDARTE ALTERADO* 🖼️\n\nA face do nosso clã foi redefinida com sucesso.' });
        } catch (e) {
            await lux.sendMessage(from, { text: 'General, uma anomalia impediu a troca do estandarte.' }, { quoted: msg });
        }
    }
};
