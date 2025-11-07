// commands/restaurarbckp-level.js
const fs = require('fs');
const path = require('path');
const { lerDB, salvarDB, isRankingAtivo } = require('../settings/lib/ranking-logic.js');

module.exports = {
    name: 'restaurarbckp-level',
    aliases: ['restaurar-alma', 'load-level'],
    execute: async ({ lux, from, msg, sender, pushName }) => {
        // VERIFICAÇÃO DE RANKING ATIVO
        if (!isRankingAtivo(from)) {
            return await lux.sendMessage(from, { text: '📜 O sistema de ranking está desativado neste grupo. Use `!toggle-rank` para ativá-lo.' }, { quoted: msg });
        }

        const backupDbPath = path.join(__dirname, '..', 'banco de dados', 'backup-level.json');

        if (!fs.existsSync(backupDbPath)) {
            return await lux.sendMessage(from, { text: `*${pushName}*, não há nenhuma alma selada para ser restaurada.` }, { quoted: msg });
        }

        const backupDb = JSON.parse(fs.readFileSync(backupDbPath, 'utf-8'));
        const backupDoMembro = backupDb[from]?.[sender];

        if (!backupDoMembro) {
            return await lux.sendMessage(from, { text: `*${pushName}*, sua alma não foi encontrada nos pergaminhos de backup.` }, { quoted: msg });
        }

        const rankingDb = lerDB();

        if (!rankingDb[from]) rankingDb[from] = { membros: {} };

        rankingDb[from].membros[sender] = { ...backupDoMembro };

        salvarDB(rankingDb);

        await lux.sendMessage(from, { text: `🌀 *ALMA RESTAURADA* 🌀\n\n*${pushName}*, sua essência de poder foi invocada e restaurada com sucesso.` }, { quoted: msg });
    }
};
