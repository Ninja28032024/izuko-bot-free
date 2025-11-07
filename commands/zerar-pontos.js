// Salvar como: commands/zerar-pontos.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'banco de dados', 'ranking.json');
const lerDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const salvarDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

module.exports = {
    name: 'zerar-pontos',
    execute: async ({ lux, msg, from, isGroup, isOwner }) => {
        if (!isOwner) return await lux.sendMessage(from, { text: '🛡️ *ACESSO NEGADO* 🛡️' }, { quoted: msg });
        if (!isGroup) return await lux.sendMessage(from, { text: 'Mestre, os pontos de honra só existem dentro de um clã.' }, { quoted: msg });

        const targetId = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!targetId) return await lux.sendMessage(from, { text: 'Sintaxe incorreta. Use: `zerar-pontos @guerreiro`' }, { quoted: msg });

        const db = lerDB();
        const membro = db[from]?.membros?.[targetId];
        if (membro) {
            membro.pontos = 0;
            salvarDB(db);
            await lux.sendMessage(from, { text: `🍂 *DECRETO DE ESQUECIMENTO* 🍂\n\nMestre, todos os pontos de poder do guerreiro @${targetId.split('@')[0]} foram dissolvidos.`, mentions: [targetId] });
        } else {
            await lux.sendMessage(from, { text: `O guerreiro @${targetId.split('@')[0]} não possui pontos registrados para serem zerados.`, mentions: [targetId] });
        }
    }
};
