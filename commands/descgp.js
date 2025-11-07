// Salvar como: commands/descgp.js
module.exports = {
    name: 'descgp',
    // Sem aliases

    execute: async ({ lux, msg, from, isGroup, sender, args, areJidsSameUser, settings }) => {
        if (!isGroup) return;
        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;
        const botIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, settings.botLid))?.admin;

        if (!senderIsAdmin) return await lux.sendMessage(from, { text: 'Apenas generais podem reescrever os anais do clã.' }, { quoted: msg });
        if (!botIsAdmin) return await lux.sendMessage(from, { text: 'Não tenho a patente para executar esta alteração.' }, { quoted: msg });

        const novaDesc = args.join(' ');
        if (!novaDesc) return await lux.sendMessage(from, { text: 'General, escreva os novos anais (descrição) do clã.' }, { quoted: msg });

        try {
            await lux.groupUpdateDescription(from, novaDesc);
            await lux.sendMessage(from, { text: `📜 *ANAIS DO CLÃ REESCRITOS* 📜\n\nA história e o propósito do nosso clã foram atualizados.` });
        } catch (e) {
            await lux.sendMessage(from, { text: 'General, uma anomalia impediu a reescrita dos anais.' }, { quoted: msg });
        }
    }
};
