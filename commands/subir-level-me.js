// Salvar como: commands/subir-level-me.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'banco de dados', 'ranking.json');
const lerDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const salvarDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

module.exports = {
    name: 'subir-level-me',
    execute: async ({ lux, msg, from, isGroup, sender, isOwner, pushName }) => {
        if (!isOwner) return await lux.sendMessage(from, { text: '🛡️ *ACESSO NEGADO* 🛡️' }, { quoted: msg });
        if (!isGroup) return await lux.sendMessage(from, { text: 'Mestre, sua ascensão deve ser testemunhada por um clã.' }, { quoted: msg });

        const db = lerDB();
        if (!db[from]) db[from] = { membros: {} };
        if (!db[from].membros[sender]) db[from].membros[sender] = { nome: pushName, nivel: 0, xp: 0, pontos: 0 };

        const membro = db[from].membros[sender];
        membro.nivel += 1;
        salvarDB(db);

        await lux.sendMessage(from, { text: `👑 *PODER SUPREMO MANIFESTADO* 👑\n\nMestre, sua força cresce. Vossa Senhoria ascendeu para a *Patente ${membro.nivel}*!` }, { quoted: msg });
    }
};
