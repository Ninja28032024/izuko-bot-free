// Salvar como: commands/xp-me.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'banco de dados', 'ranking.json');
const lerDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const salvarDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

module.exports = {
    name: 'xp-me',
    execute: async ({ lux, msg, from, isGroup, sender, isOwner, args, pushName }) => {
        if (!isOwner) return await lux.sendMessage(from, { text: '🛡️ *ACESSO NEGADO* 🛡️\n\nEste jutsu de auto-aprimoramento é reservado ao Mestre Supremo.' }, { quoted: msg });
        if (!isGroup) return await lux.sendMessage(from, { text: 'Mestre, a honra (XP) só pode ser manifestada dentro de um clã (grupo).' }, { quoted: msg });

        const quantidade = parseInt(args[0]);
        if (isNaN(quantidade) || quantidade <= 0) return await lux.sendMessage(from, { text: 'Sintaxe incorreta. Use: `xp-me <quantidade>`' }, { quoted: msg });
        if (quantidade > 100) return await lux.sendMessage(from, { text: 'Mestre, o limite para auto-aprimoramento por decreto é de 100 XP.' }, { quoted: msg });

        const db = lerDB();
        if (!db[from]) db[from] = { membros: {} };
        if (!db[from].membros[sender]) db[from].membros[sender] = { nome: pushName, nivel: 1, xp: 0, pontos: 0 };
        
        db[from].membros[sender].xp += quantidade;
        salvarDB(db);

        await lux.sendMessage(from, { text: `✨ *DECRETO DE HONRA* ✨\n\nMestre, por sua própria vontade, *${quantidade} XP* foram adicionados à sua reserva.` }, { quoted: msg });
    }
};
