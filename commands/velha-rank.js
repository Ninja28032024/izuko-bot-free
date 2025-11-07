// commands/velha-rank.js
// Comando para ver o ranking do Jogo da Velha
// VERSÃO CORRIGIDA - Filtra por grupo e mostra nomes corretos

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

module.exports = {
    name: 'velha-rank',
    aliases: ['velha-ranking', 'velharank', 'vrank'],
    description: 'Mostra o ranking do Jogo da Velha no grupo',
    
    async execute({ lux, from, msg, isGroup }) {
        try {
            if (!isGroup) {
                return await lux.sendMessage(from, { 
                    text: '❌ Este comando só funciona em grupos!' 
                });
            }

            const dbPath = path.join(__dirname, '..', 'banco de dados', 'velha_games.json');

            if (!fs.existsSync(dbPath)) {
                return await lux.sendMessage(from, { 
                    text: '🏆 Nenhuma partida foi jogada ainda!' 
                }, { quoted: msg });
            }

            const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
            
            // Verificar se há jogos completados
            if (!db.completed_games || db.completed_games.length === 0) {
                return await lux.sendMessage(from, { 
                    text: '🏆 Nenhuma partida foi jogada ainda!' 
                }, { quoted: msg });
            }

            // Filtrar jogos deste grupo
            const jogosDoGrupo = db.completed_games.filter(jogo => jogo.groupId === from);

            if (jogosDoGrupo.length === 0) {
                return await lux.sendMessage(from, { 
                    text: '🏆 Nenhuma partida foi jogada ainda neste grupo!' 
                }, { quoted: msg });
            }

            // Criar mapa de estatísticas dos jogadores deste grupo
            const statsDoGrupo = {};

            jogosDoGrupo.forEach(jogo => {
                // Processar player1
                if (!statsDoGrupo[jogo.player1.id]) {
                    statsDoGrupo[jogo.player1.id] = {
                        id: jogo.player1.id,
                        nome: jogo.player1.name,
                        wins: 0,
                        losses: 0,
                        draws: 0,
                        total_games: 0
                    };
                }

                statsDoGrupo[jogo.player1.id].total_games++;

                if (jogo.winner === 'player1') {
                    statsDoGrupo[jogo.player1.id].wins++;
                } else if (jogo.winner === 'player2') {
                    statsDoGrupo[jogo.player1.id].losses++;
                } else if (jogo.status === 'draw') {
                    statsDoGrupo[jogo.player1.id].draws++;
                }

                // Processar player2
                if (!statsDoGrupo[jogo.player2.id]) {
                    statsDoGrupo[jogo.player2.id] = {
                        id: jogo.player2.id,
                        nome: jogo.player2.name,
                        wins: 0,
                        losses: 0,
                        draws: 0,
                        total_games: 0
                    };
                }

                statsDoGrupo[jogo.player2.id].total_games++;

                if (jogo.winner === 'player2') {
                    statsDoGrupo[jogo.player2.id].wins++;
                } else if (jogo.winner === 'player1') {
                    statsDoGrupo[jogo.player2.id].losses++;
                } else if (jogo.status === 'draw') {
                    statsDoGrupo[jogo.player2.id].draws++;
                }
            });

            // Converter para array e ordenar por vitórias
            const ranking = Object.values(statsDoGrupo).sort((a, b) => {
                // Primeiro por vitórias
                if (b.wins !== a.wins) return b.wins - a.wins;
                // Se empate, por taxa de vitória
                const taxaA = a.total_games > 0 ? a.wins / a.total_games : 0;
                const taxaB = b.total_games > 0 ? b.wins / b.total_games : 0;
                return taxaB - taxaA;
            });

            // Montar mensagem e coletar JIDs para menções
            let mensagem = '🏆 *RANKING - JOGO DA VELHA* 🏆\n\n';
            mensagem += `📊 Total de partidas no grupo: *${jogosDoGrupo.length}*\n`;
            mensagem += `👥 Total de jogadores: *${ranking.length}*\n\n`;

            const mencoes = [];

            // Mostrar top 10
            ranking.slice(0, 10).forEach((stat, index) => {
                const posicao = index + 1;
                const emoji = posicao === 1 ? '🥇' : posicao === 2 ? '🥈' : posicao === 3 ? '🥉' : `${posicao}º`;
                const winRate = stat.total_games > 0 
                    ? ((stat.wins / stat.total_games) * 100).toFixed(1) 
                    : 0;

                // Extrair número do JID para menção
                const playerNumber = stat.id.split('@')[0];
                
                // Adicionar JID à lista de menções
                mencoes.push(stat.id);

                mensagem += `${emoji} @${playerNumber}\n`;
                mensagem += `   🎮 Partidas: ${stat.total_games} | ✅ Vitórias: ${stat.wins}\n`;
                mensagem += `   ❌ Derrotas: ${stat.losses} | 🤝 Empates: ${stat.draws}\n`;
                mensagem += `   📈 Taxa: ${winRate}%\n\n`;
            });

            if (ranking.length > 10) {
                mensagem += `_... e mais ${ranking.length - 10} jogador(es)_`;
            }

            await lux.sendMessage(from, { 
                text: mensagem,
                mentions: mencoes
            }, { quoted: msg });

            console.log(chalk.green(`[VELHA-RANK] Ranking exibido para o grupo ${from}`));

        } catch (error) {
            console.error(chalk.red('[VELHA-RANK] Erro ao buscar ranking:'), error);
            await lux.sendMessage(from, { 
                text: `❌ Erro ao buscar ranking!\n\nDetalhes: ${error.message}` 
            }, { quoted: msg });
        }
    }
};
