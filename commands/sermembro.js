// Salvar como: commands/sermembro.js
module.exports = {
    name: 'sermembro',
    // Sem aliases, conforme ordenado.

    execute: async ({ lux, msg, from, isGroup, sender, settings, areJidsSameUser }) => {
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'General, este ato de humildade só pode ser realizado dentro de um clã (grupo).' }, { quoted: msg });
        }

        try {
            const groupMeta = await lux.groupMetadata(from);
            const botIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, settings.botLid))?.admin;

            // Verifica se eu tenho a patente necessária para executar a ordem.
            if (!botIsAdmin) {
                return await lux.sendMessage(from, { text: 'General, não possuo a patente necessária neste clã para alterar sua designação.' }, { quoted: msg });
            }

            const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;

            // Verifica se o invocador é de fato um general.
            if (!senderIsAdmin) {
                return await lux.sendMessage(from, { text: 'Guerreiro, você já se encontra entre os membros do clã. Este jutsu não tem efeito sobre você.' }, { quoted: msg });
            }

            // O ritual de rebaixamento.
            await lux.groupParticipantsUpdate(from, [sender], 'demote');
            await lux.sendMessage(from, { text: '🛡️ *RETORNO AO CLÃ* 🛡️\n\nEm um ato de humildade, o General abdicou de sua patente e agora caminha novamente entre os guerreiros.' }, { quoted: msg });

        } catch (error) {
            console.error("Erro no jutsu 'sermembro':", error);
            await lux.sendMessage(from, { text: 'General, uma anomalia impediu o ritual de rebaixamento. Sua patente permanece inalterada.' }, { quoted: msg });
        }
    }
};
