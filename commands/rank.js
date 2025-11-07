// commands/rank.js
const { lerDB, getPatentePorNivel, isRankingAtivo } = require('../settings/lib/ranking-logic.js');

module.exports = {
    name: 'rank',
    aliases: ['ranking', 'classificacao'],
    execute: async ({ lux, from, msg }) => {
        // =================================================================
        // == NOVA VERIFICAÇÃO DE RANKING ATIVO
        // =================================================================
        if (!isRankingAtivo(from)) {
            return await lux.sendMessage(from, { text: '📜 O sistema de ranking está desativado neste grupo. Use `!toggle-rank` para ativá-lo.' }, { quoted: msg });
        }
        // =================================================================

        const db = lerDB();
        const grupo = db[from];

        if (!grupo || Object.keys(grupo.membros).length === 0) {
            return await lux.sendMessage(from, { text: '📜 O Pergaminho dos Campeões deste clã ainda está em branco.' }, { quoted: msg });
        }

        const membrosArray = Object.entries(grupo.membros).map(([id, dados]) => ({ id, ...dados }));
        
        membrosArray.sort((a, b) => {
            if (b.nivel !== a.nivel) {
                return b.nivel - a.nivel; // Ordena pela patente primeiro
            }
            return b.xp - a.xp; // Se a patente for a mesma, desempata pelo XP
        });

        let rankText = '📜 *PERGAMINHO DOS CAMPEÕES DO CLÃ*\n\n';
        const top10 = membrosArray.slice(0, 10);
        const medalhas = ['🥇', '🥈', '🥉'];

        top10.forEach((membro, index) => {
            const patente = getPatentePorNivel(membro.nivel);
            const medalha = medalhas[index] ? `${medalhas[index]} ` : `${index + 1}.`;
            rankText += `${medalha} *${membro.nome}*\n   └ Patente: ${patente.nome} (XP: ${membro.xp})\n`;
        });

        await lux.sendMessage(from, { text: rankText.trim() }, { quoted: msg });
    }
};
