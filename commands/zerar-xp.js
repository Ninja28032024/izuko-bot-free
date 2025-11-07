// Salvar como: commands/zerar-xp.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'banco de dados', 'ranking.json');
const lerDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const salvarDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

module.exports = {
    name: 'zerar-xp',
    execute: async ({ lux, msg, from, isGroup, isOwner }) => {
        if (!isOwner) return await lux.sendMessage(from, { text: '🛡️ *ACESSO NEGADO* 🛡️\n\nEste decreto de anulação é reservado ao Mestre Supremo.' }, { quoted: msg });
        if (!isGroup) return await lux.sendMessage(from, { text: 'Mestre, a honra (XP) só existe dentro de um clã (grupo).' }, { quoted: msg });

        const targetId = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!targetId) return await lux.sendMessage(from, { text: 'Sintaxe incorreta. Use: `zerar-xp @guerreiro`' }, { quoted: msg });

        const db = lerDB();
        const membro = db[from]?.membros?.[targetId];
        if (membro) {
            membro.xp = 0;
            salvarDB(db);
            await lux.sendMessage(from, { text: `🍂 *DECRETO DE ESQUECIMENTO* 🍂\n\nMestre, toda a honra bruta (XP) do guerreiro @${targetId.split('@')[0]} foi dissolvida.`, mentions: [targetId] });
        } else {
            await lux.sendMessage(from, { text: `O guerreiro @${targetId.split('@')[0]} não possui honra registrada para ser zerada.`, mentions: [targetId] });
        }
    }
};
