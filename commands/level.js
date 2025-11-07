// commands/level.js
const { lerDB, getPatentePorNivel, PONTOS_PARA_UPAR, isRankingAtivo } = require('../settings/lib/ranking-logic.js');

module.exports = {
    name: 'level',
    aliases: ['nivel', 'patente'],
    execute: async ({ lux, from, msg, sender, pushName }) => {
        // =================================================================
        // == NOVA VERIFICAÇÃO DE RANKING ATIVO
        // =================================================================
        if (!isRankingAtivo(from)) {
            return await lux.sendMessage(from, { text: '📜 O sistema de ranking está desativado neste grupo. Use `!toggle-rank` para ativá-lo.' }, { quoted: msg });
        }
        // =================================================================

        const db = lerDB();
        const membro = db[from]?.membros[sender];

        if (!membro) {
            return await lux.sendMessage(from, { text: `*${pushName}*, sua jornada ainda não começou. Interaja para registrar seu poder!` }, { quoted: msg });
        }

        const patente = getPatentePorNivel(membro.nivel);
        const pontosFaltantes = PONTOS_PARA_UPAR - membro.pontos;

        let levelText = `⚔️ *STATUS DO GUERREIRO: ${pushName}*\n\n`;
        levelText += `*Patente Atual:* ${patente.nome}\n`;
        levelText += `*XP (para conversão):* ${membro.xp}\n`;
        levelText += `*Pontos (para upar):* ${membro.pontos}\n\n`;
        levelText += `*Progresso:* ${membro.pontos} / ${PONTOS_PARA_UPAR} Pontos para a próxima patente.\n`;
        levelText += `*Faltam:* ${pontosFaltantes > 0 ? pontosFaltantes : 'Nível Máximo Atingido'} Pontos.`;

        await lux.sendMessage(from, { text: levelText }, { quoted: msg });
    }
};
