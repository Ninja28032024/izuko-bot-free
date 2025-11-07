// Salvar como: commands/desativar-msg-tmp.js
module.exports = {
    name: 'desativar-msg-tmp',
    // Sem aliases, conforme ordenado.

    execute: async ({ lux, msg, from, isGroup, sender, areJidsSameUser, settings }) => {
        if (!isGroup) return await lux.sendMessage(from, { text: 'General, este decreto só pode ser proclamado em um clã.' }, { quoted: msg });

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;
        const botIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, settings.botLid))?.admin;

        if (!senderIsAdmin) return await lux.sendMessage(from, { text: 'Apenas generais podem revogar a lei da efemeridade.' }, { quoted: msg });
        if (!botIsAdmin) return await lux.sendMessage(from, { text: 'Não tenho a patente necessária para executar este decreto.' }, { quoted: msg });

        // Para desativar, a API espera o valor 0.
        const duracaoSegundos = 0;
        
        try {
            // Verifica se as mensagens já estão permanentes para não executar um comando desnecessário.
            if (groupMeta.ephemeralDuration === 0 || !groupMeta.ephemeralDuration) {
                return await lux.sendMessage(from, { text: 'General, as mensagens neste clã já são permanentes. A lei da efemeridade não está em vigor.' }, { quoted: msg });
            }

            await lux.groupToggleEphemeral(from, duracaoSegundos);
            await lux.sendMessage(from, { text: `⏳ *LEI DA EFEMERIDADE REVOGADA* ⏳\n\nPor decreto de um general, as mensagens neste clã agora são *permanentes*.` });
        } catch (e) {
            await lux.sendMessage(from, { text: 'General, uma anomalia impediu a revogação da lei da efemeridade.' }, { quoted: msg });
        }
    }
};
