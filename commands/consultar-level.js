// Salvar como: commands/consultar-level.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'banco de dados', 'ranking.json');
const lerDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

module.exports = {
    name: 'consultar-level',
    execute: async ({ lux, msg, from, isGroup }) => {
        if (!isGroup) return await lux.sendMessage(from, { text: 'Mestre, a honra e as patentes só podem ser consultadas dentro de um clã.' }, { quoted: msg });

        const targetId = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!targetId) return await lux.sendMessage(from, { text: 'Sintaxe incorreta. Use: `consultar-level @guerreiro`' }, { quoted: msg });

        const db = lerDB();
        const membro = db[from]?.membros?.[targetId];

        let profilePicUrl;
        try {
            profilePicUrl = await lux.profilePictureUrl(targetId, 'image');
        } catch {
            profilePicUrl = 'https://i.imgur.com/1v3fVv1.jpeg';
        }

        const targetName = targetId.split('@' )[0];
        let legenda;

        if (membro) {
            legenda = `
📜 *ANAIS DE HONRA DO GUERREIRO* 📜

*Guerreiro:* @${targetName}
*Patente:* Nível ${membro.nivel || 1}
*Honra Bruta (XP):* ${membro.xp || 0}
*Poder de Ascensão (Pontos):* ${membro.pontos || 0}
`;
        } else {
            legenda = `
📜 *GUERREIRO NÃO REGISTRADO* 📜

O guerreiro @${targetName} ainda não iniciou sua jornada de honra neste clã.
`;
        }

        await lux.sendMessage(from, {
            image: { url: profilePicUrl },
            caption: legenda.trim(),
            mentions: [targetId]
        });
    }
};
