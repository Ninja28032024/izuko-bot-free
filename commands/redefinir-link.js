// Salvar como: commands/redefinir-link.js
module.exports = {
    name: 'redefinir-link',
    // Sem aliases

    execute: async ({ lux, msg, from, isGroup, sender, areJidsSameUser, settings }) => {
        if (!isGroup) return;
        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;
        const botIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, settings.botLid))?.admin;

        if (!senderIsAdmin) return await lux.sendMessage(from, { text: 'Apenas generais podem reforjar o portal de entrada.' }, { quoted: msg });
        if (!botIsAdmin) return await lux.sendMessage(from, { text: 'Não tenho a patente para executar este ritual.' }, { quoted: msg });

        try {
            await lux.groupRevokeInvite(from);
            const novoLink = await lux.groupInviteCode(from);
            await lux.sendMessage(from, { text: `⚜️ *PORTAL REFORJADO* ⚜️\n\nGeneral, o antigo portal foi selado. O novo caminho para este clã é:\n\nhttps://chat.whatsapp.com/${novoLink}` } );
        } catch (e) {
            await lux.sendMessage(from, { text: 'General, uma anomalia impediu a reforja do portal.' }, { quoted: msg });
        }
    }
};
