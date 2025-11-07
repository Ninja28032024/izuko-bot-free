// Salvar como: commands/citar-descgp.js
module.exports = {
    name: 'citar-descgp',
    // Sem aliases, conforme ordenado.

    execute: async ({ lux, msg, from, isGroup, sender, areJidsSameUser }) => {
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, os anais de um clã só podem ser recitados dentro de seus próprios domínios (em um grupo).' }, { quoted: msg });
        }

        try {
            const groupMeta = await lux.groupMetadata(from);
            
            // --- SELO DE HIERARQUIA (NOVA RESTRIÇÃO) ---
            const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;

            if (!senderIsAdmin) {
                return await lux.sendMessage(from, { text: 'Guerreiro, apenas os generais (admins) deste clã podem consultar seus anais secretos.' }, { quoted: msg });
            }
            // --- FIM DO SELO ---

            const groupDesc = groupMeta.desc?.toString();
            let resposta;

            if (groupDesc) {
                resposta = `General, atendo ao seu chamado. Aqui estão os anais deste clã:\n\n------------------------------------\n${groupDesc}`;
            } else {
                resposta = 'General, os anais deste clã estão em branco. Nenhum propósito ou história foi registrado.';
            }

            await lux.sendMessage(from, { text: resposta }, { quoted: msg });

        } catch (error) {
            console.error("Erro no jutsu 'citar-descgp':", error);
            await lux.sendMessage(from, { text: 'General, uma sombra me impediu de consultar os anais deste clã. O ritual falhou.' }, { quoted: msg });
        }
    }
};
