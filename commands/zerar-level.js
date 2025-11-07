// commands/zerar-level.js
const { lerDB, salvarDB, isRankingAtivo } = require('../settings/lib/ranking-logic.js');

module.exports = {
    name: 'zerar-level',
    aliases: ['resetar-level', 'zerarlevel'],
    execute: async ({ lux, from, msg, sender, pushName }) => {
        // VERIFICAÇÃO DE RANKING ATIVO
        if (!isRankingAtivo(from)) {
            return await lux.sendMessage(from, { text: '📜 O sistema de ranking está desativado neste grupo. Use `!toggle-rank` para ativá-lo.' }, { quoted: msg });
        }

        const db = lerDB();

        if (!db[from] || !db[from].membros[sender]) {
            return await lux.sendMessage(from, { text: `*${pushName}*, sua jornada ainda nem começou. Não há poder para ser zerado.` }, { quoted: msg });
        }

        db[from].membros[sender] = {
            nome: pushName,
            nivel: 1,
            xp: 0,
            pontos: 0
        };

        salvarDB(db);

        await lux.sendMessage(from, { text: `🔥 *RENASCIMENTO DO GUERREIRO* 🔥\n\n*${pushName}*, atendendo ao seu chamado, seu poder foi selado e sua jornada recomeça agora. Sua patente, XP e Pontos foram zerados.` }, { quoted: msg });
    }
};
