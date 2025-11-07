// Salvar como: commands/backup-rank-user.js
const fs = require('fs');
const path = require('path');

const rankingDbPath = path.join(__dirname, '..', 'banco de dados', 'ranking.json');
const backupDbPath = path.join(__dirname, '..', 'banco de dados', 'backup-rank.json');

const lerDB = (caminho) => {
    if (!fs.existsSync(caminho)) return {};
    return JSON.parse(fs.readFileSync(caminho, 'utf-8'));
};
const salvarDB = (caminho, dados) => fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

module.exports = {
    name: 'backup-rank-user',
    execute: async ({ lux, msg, from, isGroup, isOwner }) => {
        if (!isOwner) return await lux.sendMessage(from, { text: '🛡️ *ACESSO NEGADO* 🛡️' }, { quoted: msg });
        if (!isGroup) return await lux.sendMessage(from, { text: 'Mestre, a alma de um guerreiro só pode ser selada dentro do clã onde sua honra foi forjada.' }, { quoted: msg });

        const targetId = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!targetId) return await lux.sendMessage(from, { text: 'Sintaxe incorreta. Use: `backup-rank-user @guerreiro`' }, { quoted: msg });

        const rankingDb = lerDB(rankingDbPath);
        const membro = rankingDb[from]?.membros?.[targetId];

        if (!membro) return await lux.sendMessage(from, { text: `Mestre, o guerreiro @${targetId.split('@')[0]} não possui um registro para ser selado.`, mentions: [targetId] });

        const backupDb = lerDB(backupDbPath);
        if (!backupDb[from]) backupDb[from] = {};
        
        backupDb[from][targetId] = { ...membro, timestamp: Date.now() };
        salvarDB(backupDbPath, backupDb);

        await lux.sendMessage(from, { text: `✅ *ALMA SELADA* ✅\n\nMestre, a essência de poder do guerreiro @${targetId.split('@')[0]} foi selada com sucesso.`, mentions: [targetId] });
    }
};
