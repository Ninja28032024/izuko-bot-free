// Salvar como: commands/subir-level.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'banco de dados', 'ranking.json');
const lerDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const salvarDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

module.exports = {
    name: 'subir-level',
    execute: async ({ lux, msg, from, isGroup, isOwner, pushName }) => {
        if (!isOwner) return await lux.sendMessage(from, { text: '🛡️ *ACESSO NEGADO* 🛡️' }, { quoted: msg });
        if (!isGroup) return await lux.sendMessage(from, { text: 'Mestre, a ascensão de patente só pode ocorrer dentro de um clã.' }, { quoted: msg });

        const targetId = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!targetId) return await lux.sendMessage(from, { text: 'Sintaxe incorreta. Use: `subir-level @guerreiro`' }, { quoted: msg });

        const db = lerDB();
        if (!db[from]) db[from] = { membros: {} };
        if (!db[from].membros[targetId]) db[from].membros[targetId] = { nome: 'Nome a ser atualizado', nivel: 0, xp: 0, pontos: 0 };
        
        const membro = db[from].membros[targetId];
        membro.nivel += 1;
        salvarDB(db);

        await lux.sendMessage(from, { text: `🚀 *ASCENSÃO DE PATENTE* 🚀\n\nPor decreto do Mestre, o guerreiro @${targetId.split('@')[0]} ascendeu para a *Patente ${membro.nivel}*!`, mentions: [targetId] });
    }
};
