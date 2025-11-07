// Salvar como: commands/adm-list.js
module.exports = {
    name: 'adm-list',
    // Sem aliases, conforme ordenado.

    execute: async ({ lux, msg, from, isGroup }) => {
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, a hierarquia de um clã só pode ser consultada dentro de seus próprios domínios.' }, { quoted: msg });
        }

        try {
            const groupMeta = await lux.groupMetadata(from);
            
            // Filtra a lista de participantes para encontrar apenas os que têm a patente 'admin' ou 'superadmin'.
            const admins = groupMeta.participants.filter(p => p.admin);

            if (admins.length === 0) {
                return await lux.sendMessage(from, { text: 'Mestre, este clã parece não ter generais designados.' }, { quoted: msg });
            }

            let resposta = '⚜️ *HIERARQUIA DO CLÃ: LISTA DE GENERAIS* ⚜️\n\nEstes são os guerreiros que detêm a autoridade neste clã:\n\n';
            const mentions = [];

            admins.forEach((admin, index) => {
                const adminId = admin.id;
                resposta += `${index + 1}. @${adminId.split('@')[0]}\n`;
                mentions.push(adminId);
            });

            // Envia a lista e menciona todos os generais para que sejam notificados.
            await lux.sendMessage(from, { 
                text: resposta.trim(),
                mentions: mentions 
            }, { quoted: msg });

        } catch (error) {
            console.error("Erro no jutsu 'adm-list':", error);
            await lux.sendMessage(from, { text: 'Mestre, uma sombra me impediu de consultar a hierarquia deste clã.' }, { quoted: msg });
        }
    }
};
