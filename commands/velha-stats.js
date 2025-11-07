// commands/velha-stats.js
// Comando para ver estatísticas do Jogo da Velha
// VERSÃO CORRIGIDA - Calcula estatísticas corretamente

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

module.exports = {
    name: 'velha-stats',
    aliases: ['velha-estatisticas', 'velhastats', 'vstats'],
    description: 'Mostra suas estatísticas no Jogo da Velha',
    
    async execute({ lux, from, msg, sender, pushName, isGroup }) {
        try {
            if (!isGroup) {
                return await lux.sendMessage(from, { 
                    text: '❌ Este comando só funciona em grupos!' 
                });
            }

            const dbPath = path.join(__dirname, '..', 'banco de dados', 'velha_games.json');

            if (!fs.existsSync(dbPath)) {
                return await lux.sendMessage(from, { 
                    text: '📊 Você ainda não jogou nenhuma partida de Jogo da Velha!' 
                }, { quoted: msg });
            }

            const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

            // Verificar se há jogos completados
            if (!db.completed_games || db.completed_games.length === 0) {
                return await lux.sendMessage(from, { 
                    text: '📊 Você ainda não jogou nenhuma partida de Jogo da Velha!' 
                }, { quoted: msg });
            }

            // Filtrar jogos deste jogador
            const jogosDoJogador = db.completed_games.filter(jogo => 
                jogo.player1.id === sender || jogo.player2.id === sender
            );

            if (jogosDoJogador.length === 0) {
                return await lux.sendMessage(from, { 
                    text: '📊 Você ainda não jogou nenhuma partida de Jogo da Velha!' 
                }, { quoted: msg });
            }

            // Calcular estatísticas
            let wins = 0;
            let losses = 0;
            let draws = 0;

            jogosDoJogador.forEach(jogo => {
                const ehPlayer1 = jogo.player1.id === sender;

                if (jogo.status === 'draw') {
                    draws++;
                } else if (jogo.winner === 'player1' && ehPlayer1) {
                    wins++;
                } else if (jogo.winner === 'player2' && !ehPlayer1) {
                    wins++;
                } else {
                    losses++;
                }
            });

            const total_games = jogosDoJogador.length;
            const winRate = total_games > 0 
                ? ((wins / total_games) * 100).toFixed(1) 
                : 0;

            // Calcular posição no ranking do grupo
            const jogosDoGrupo = db.completed_games.filter(jogo => jogo.groupId === from);
            const statsDoGrupo = {};

            jogosDoGrupo.forEach(jogo => {
                // Processar player1
                if (!statsDoGrupo[jogo.player1.id]) {
                    statsDoGrupo[jogo.player1.id] = { wins: 0, total: 0 };
                }
                statsDoGrupo[jogo.player1.id].total++;
                if (jogo.winner === 'player1') statsDoGrupo[jogo.player1.id].wins++;

                // Processar player2
                if (!statsDoGrupo[jogo.player2.id]) {
                    statsDoGrupo[jogo.player2.id] = { wins: 0, total: 0 };
                }
                statsDoGrupo[jogo.player2.id].total++;
                if (jogo.winner === 'player2') statsDoGrupo[jogo.player2.id].wins++;
            });

            const ranking = Object.entries(statsDoGrupo)
                .sort((a, b) => b[1].wins - a[1].wins)
                .map(([id]) => id);

            const posicaoNoGrupo = ranking.indexOf(sender) + 1;

            const mensagem = `📊 *ESTATÍSTICAS DO JOGO DA VELHA*\n\n👤 Jogador: *${pushName}*\n\n🎮 Total de Partidas: *${total_games}*\n✅ Vitórias: *${wins}*\n❌ Derrotas: *${losses}*\n🤝 Empates: *${draws}*\n\n📈 Taxa de Vitória: *${winRate}%*\n🏆 Posição no Grupo: *${posicaoNoGrupo}º de ${ranking.length}*`;

            await lux.sendMessage(from, { text: mensagem }, { quoted: msg });

            console.log(chalk.green(`[VELHA-STATS] Estatísticas exibidas para ${pushName}`));

        } catch (error) {
            console.error(chalk.red('[VELHA-STATS] Erro ao buscar estatísticas:'), error);
            await lux.sendMessage(from, { 
                text: `❌ Erro ao buscar estatísticas!\n\nDetalhes: ${error.message}` 
            }, { quoted: msg });
        }
    }
};
