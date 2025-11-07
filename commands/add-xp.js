// Salvar como: commands/add-xp.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'banco de dados', 'ranking.json');
const lerDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const salvarDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

module.exports = {
    name: 'add-xp',
    execute: async ({ lux, msg, from, isGroup, isOwner, args, pushName }) => {
        if (!isOwner) return await lux.sendMessage(from, { text: '🛡️ *ACESSO NEGADO* 🛡️' }, { quoted: msg });
        if (!isGroup) return await lux.sendMessage(from, { text: 'Mestre, a honra (XP) só pode ser concedida dentro de um clã.' }, { quoted: msg });

        const targetId = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const quantidade = parseInt(args.find(arg => !isNaN(parseInt(arg))));
        if (!targetId || isNaN(quantidade) || quantidade <= 0) return await lux.sendMessage(from, { text: 'Sintaxe incorreta. Use: `add-xp @guerreiro <quantidade>`' }, { quoted: msg });

        const db = lerDB();
        if (!db[from]) db[from] = { membros: {} };
        if (!db[from].membros[targetId]) db[from].membros[targetId] = { nome: 'Nome a ser atualizado', nivel: 1, xp: 0, pontos: 0 };
        
        db[from].membros[targetId].xp += quantidade;
        salvarDB(db);

        await lux.sendMessage(from, { text: `✨ *DÁDIVA DE HONRA* ✨\n\nMestre, o guerreiro @${targetId.split('@')[0]} foi abençoado com *${quantidade} XP*.`, mentions: [targetId] });
    }
};
