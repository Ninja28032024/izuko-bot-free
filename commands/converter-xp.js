// commands/converter-xp.js
const { lerDB, salvarDB, PONTOS_POR_XP, processarUpgrade, isRankingAtivo } = require('../settings/lib/ranking-logic.js');

module.exports = {
    name: 'converter-xp',
    aliases: ['forjar-xp'],
    execute: async ({ lux, from, msg, sender, pushName }) => {
        // VERIFICAÇÃO DE RANKING ATIVO
        if (!isRankingAtivo(from)) {
            return await lux.sendMessage(from, { text: '📜 O sistema de ranking está desativado neste grupo. Use `!toggle-rank` para ativá-lo.' }, { quoted: msg });
        }

        const db = lerDB();
        const membro = db[from]?.membros[sender];

        if (!membro || membro.xp === 0) {
            return await lux.sendMessage(from, { text: `*${pushName}*, você não possui XP para forjar em Pontos no momento.` }, { quoted: msg });
        }

        const xpConvertido = membro.xp;
        const pontosGanhos = xpConvertido * PONTOS_POR_XP;
        membro.xp = 0;
        membro.pontos += pontosGanhos;

        salvarDB(db);

        await lux.sendMessage(from, { text: `🔥 *FORJA DE PODER* 🔥\n\n*${pushName}*, você converteu *${xpConvertido} XP* em *${pontosGanhos} Pontos*!\nSeu poder agora será usado para ascender nas patentes.` }, { quoted: msg });

        await processarUpgrade(lux, from, sender, pushName, membro, db);
    }
};
