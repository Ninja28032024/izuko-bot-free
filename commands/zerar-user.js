// Salvar como: commands/zerar-user.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'banco de dados', 'ranking.json');
const lerDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const salvarDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

module.exports = {
    name: 'zerar-user',
    execute: async ({ lux, msg, from, isGroup, isOwner }) => {
        if (!isOwner) return await lux.sendMessage(from, { text: '🛡️ *ACESSO NEGADO* 🛡️' }, { quoted: msg });
        if (!isGroup) return await lux.sendMessage(from, { text: 'Mestre, os anais de honra só existem dentro de um clã.' }, { quoted: msg });

        const targetId = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!targetId) return await lux.sendMessage(from, { text: 'Sintaxe incorreta. Use: `zerar-user @guerreiro`' }, { quoted: msg });

        const db = lerDB();
        const membro = db[from]?.membros?.[targetId];
        if (membro) {
            membro.nivel = 1;
            membro.xp = 0;
            membro.pontos = 0;
            salvarDB(db);
            await lux.sendMessage(from, { text: `🌪️ *DECRETO DE RENASCIMENTO* 🌪️\n\nMestre, o guerreiro @${targetId.split('@')[0]} foi renascido. Sua jornada recomeça do zero.`, mentions: [targetId] });
        } else {
            await lux.sendMessage(from, { text: `O guerreiro @${targetId.split('@')[0]} não possui registros nos anais para serem reiniciados.`, mentions: [targetId] });
        }
    }
};
