// Salvar como: commands/msg-adm.js
module.exports = {
    name: 'msg-adm',
    // Sem aliases

    execute: async ({ lux, msg, from, isGroup, sender, areJidsSameUser, settings }) => {
        if (!isGroup) return;
        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;
        const botIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, settings.botLid))?.admin;

        if (!senderIsAdmin) return await lux.sendMessage(from, { text: 'Apenas generais podem silenciar o clã.' }, { quoted: msg });
        if (!botIsAdmin) return await lux.sendMessage(from, { text: 'Não tenho a patente para executar este decreto.' }, { quoted: msg });

        try {
            await lux.groupSettingUpdate(from, 'announcement');
            await lux.sendMessage(from, { text: '🔒 *DECRETO DO SILÊNCIO* 🔒\n\nApenas os generais podem agora proferir palavras neste clã.' });
        } catch (e) {
            await lux.sendMessage(from, { text: 'General, uma anomalia impediu o decreto do silêncio.' }, { quoted: msg });
        }
    }
};
