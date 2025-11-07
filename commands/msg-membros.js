// Salvar como: commands/msg-membros.js
module.exports = {
    name: 'msg-membros',
    // Sem aliases

    execute: async ({ lux, msg, from, isGroup, sender, areJidsSameUser, settings }) => {
        if (!isGroup) return;
        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;
        const botIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, settings.botLid))?.admin;

        if (!senderIsAdmin) return await lux.sendMessage(from, { text: 'Apenas generais podem quebrar o silêncio do clã.' }, { quoted: msg });
        if (!botIsAdmin) return await lux.sendMessage(from, { text: 'Não tenho a patente para executar este decreto.' }, { quoted: msg });

        try {
            await lux.groupSettingUpdate(from, 'not_announcement');
            await lux.sendMessage(from, { text: '🔓 *FIM DO SILÊNCIO* 🔓\n\nAs vozes de todos os guerreiros podem novamente ecoar neste clã.' });
        } catch (e) {
            await lux.sendMessage(from, { text: 'General, uma anomalia impediu o fim do silêncio.' }, { quoted: msg });
        }
    }
};
