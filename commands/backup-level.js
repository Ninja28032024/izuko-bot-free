// commands/backup-level.js
const fs = require('fs');
const path = require('path');
const { lerDB, isRankingAtivo } = require('../settings/lib/ranking-logic.js');

module.exports = {
    name: 'backup-level',
    aliases: ['salvar-alma', 'bckp-level'],
    execute: async ({ lux, from, msg, sender, pushName }) => {
        // VERIFICAÇÃO DE RANKING ATIVO
        if (!isRankingAtivo(from)) {
            return await lux.sendMessage(from, { text: '📜 O sistema de ranking está desativado neste grupo. Use `!toggle-rank` para ativá-lo.' }, { quoted: msg });
        }

        const rankingDb = lerDB();
        const membro = rankingDb[from]?.membros[sender];

        if (!membro) {
            return await lux.sendMessage(from, { text: `*${pushName}*, não há poder a ser selado. Sua jornada ainda não começou.` }, { quoted: msg });
        }

        const backupDbPath = path.join(__dirname, '..', 'banco de dados', 'backup-level.json');
        let backupDb = {};

        if (fs.existsSync(backupDbPath)) {
            backupDb = JSON.parse(fs.readFileSync(backupDbPath, 'utf-8'));
        }

        if (!backupDb[from]) {
            backupDb[from] = {};
        }

        backupDb[from][sender] = { ...membro };

        fs.writeFileSync(backupDbPath, JSON.stringify(backupDb, null, 2));

        await lux.sendMessage(from, { text: `✅ *ALMA SELADA* ✅\n\n*${pushName}*, a essência do seu poder atual foi selada com sucesso. Use \`!restaurarbckp-level\` para restaurá-la.` }, { quoted: msg });
    }
};
