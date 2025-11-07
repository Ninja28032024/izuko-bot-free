// Salvar como: commands/nomegp.js
module.exports = {
    name: 'nomegp',
    // Sem aliases

    execute: async ({ lux, msg, from, isGroup, sender, args, areJidsSameUser, settings }) => {
        if (!isGroup) return;
        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;
        const botIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, settings.botLid))?.admin;

        if (!senderIsAdmin) return await lux.sendMessage(from, { text: 'Apenas generais podem renomear o clã.' }, { quoted: msg });
        if (!botIsAdmin) return await lux.sendMessage(from, { text: 'Não tenho a patente para executar este decreto.' }, { quoted: msg });

        const novoNome = args.join(' ');
        if (!novoNome) return await lux.sendMessage(from, { text: 'General, profira o novo nome para o clã.' }, { quoted: msg });

        try {
            await lux.groupUpdateSubject(from, novoNome);
            await lux.sendMessage(from, { text: `✒️ *NOME DO CLÃ ALTERADO* ✒️\n\nDe agora em diante, seremos conhecidos como: *${novoNome}*` });
        } catch (e) {
            await lux.sendMessage(from, { text: 'General, uma anomalia impediu a renomeação do clã.' }, { quoted: msg });
        }
    }
};
