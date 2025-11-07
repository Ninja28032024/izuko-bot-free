// Salvar como: commands/seradm.js
module.exports = {
    name: 'seradm',
    // Sem aliases, conforme ordenado.

    execute: async ({ lux, msg, from, isGroup, sender, isOwner, settings, areJidsSameUser }) => {
        // --- SELO DE AUTORIDADE SUPREMA ---
        // Apenas o Mestre pode invocar este jutsu.
        if (!isOwner) {
            return await lux.sendMessage(from, { text: '🛡️ *ACESSO NEGADO* 🛡️\n\nEste é um jutsu de ascensão, reservado apenas para o Mestre Supremo.' }, { quoted: msg });
        }

        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, este jutsu de ascensão só pode ser proclamado dentro de um clã (grupo).' }, { quoted: msg });
        }

        try {
            const groupMeta = await lux.groupMetadata(from);
            const botIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, settings.botLid))?.admin;

            // Verifica se eu tenho a patente necessária para executar a ordem.
            if (!botIsAdmin) {
                return await lux.sendMessage(from, { text: 'Mestre, não possuo a patente de general neste clã. Meus jutsus de controle hierárquico estão selados.' }, { quoted: msg });
            }

            const senderIsAlreadyAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;

            if (senderIsAlreadyAdmin) {
                return await lux.sendMessage(from, { text: 'Mestre, Vossa Senhoria já detém a patente de general neste clã.' }, { quoted: msg });
            }

            // O ritual de promoção.
            await lux.groupParticipantsUpdate(from, [sender], 'promote');
            await lux.sendMessage(from, { text: '👑 *ASCENSÃO CONCLUÍDA* 👑\n\nPor direito e decreto, a patente de General foi concedida a Vossa Senhoria neste clã.' }, { quoted: msg });

        } catch (error) {
            console.error("Erro no jutsu 'seradm':", error);
            await lux.sendMessage(from, { text: 'Mestre, uma perturbação no fluxo de poder impediu sua ascensão. O ritual falhou.' }, { quoted: msg });
        }
    }
};
