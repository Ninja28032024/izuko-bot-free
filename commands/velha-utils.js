// commands/velha-utils.js
// Utilitários e comandos auxiliares para o Jogo da Velha

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Importar o mapa de jogos
let velhaGames;

module.exports = {
    // Comando para aceitar um desafio
    aceitar: {
        name: 'aceitar',
        aliases: ['accept', 'sim'],
        description: 'Aceita um desafio de Jogo da Velha',
        isHidden: true,
        
        async execute({ lux, from, msg, sender, isGroup }) {
            try {
                if (!isGroup) return;

                // Carregar o mapa de jogos na primeira execução
                if (!velhaGames) {
                    const velhaModule = require('./velha.js');
                    velhaGames = velhaModule.velhaGames;
                }

                // Procurar um desafio aguardando resposta deste usuário
                const jogo = encontrarDesafioAguardando(from, sender);

                if (!jogo) {
                    return await lux.sendMessage(from, { 
                        text: '❌ Você não tem nenhum desafio de Jogo da Velha aguardando resposta!' 
                    }, { quoted: msg });
                }

                // Aceitar o desafio
                jogo.status = 'playing';

                const { renderizarTabuleiro } = require('./velha.js');
                const boardText = renderizarTabuleiro(jogo.board);

                const mensagem = `✅ *${sender.split('@')[0]} ACEITOU O DESAFIO!*\n\n${boardText}\n\n👤 ${jogo.player1.name} (❌ X) vs ${jogo.player2.name} (⭕ O)\n\n🎮 Começando o jogo!\n\n${jogo.player1.name}, é sua vez! Digite um número (1-9).`;

                await lux.sendMessage(from, { text: mensagem });

                console.log(chalk.green(`[VELHA] Desafio aceito: ${jogo.gameId}`));

            } catch (error) {
                console.error(chalk.red('[VELHA-UTILS] Erro ao aceitar desafio:'), error);
            }
        }
    },

    // Comando para rejeitar um desafio
    rejeitar: {
        name: 'rejeitar',
        aliases: ['reject', 'nao', 'não'],
        description: 'Rejeita um desafio de Jogo da Velha',
        isHidden: true,
        
        async execute({ lux, from, msg, sender, isGroup }) {
            try {
                if (!isGroup) return;

                // Carregar o mapa de jogos na primeira execução
                if (!velhaGames) {
                    const velhaModule = require('./velha.js');
                    velhaGames = velhaModule.velhaGames;
                }

                // Procurar um desafio aguardando resposta deste usuário
                const jogo = encontrarDesafioAguardando(from, sender);

                if (!jogo) {
                    return await lux.sendMessage(from, { 
                        text: '❌ Você não tem nenhum desafio de Jogo da Velha aguardando resposta!' 
                    }, { quoted: msg });
                }

                // Rejeitar o desafio
                jogo.status = 'cancelled';

                const mensagem = `❌ *${sender.split('@')[0]} REJEITOU O DESAFIO!*\n\n${jogo.player1.name}, seu desafio foi recusado. Tente novamente com outro jogador!`;

                await lux.sendMessage(from, { text: mensagem });

                velhaGames.delete(jogo.gameId);

                console.log(chalk.yellow(`[VELHA] Desafio rejeitado: ${jogo.gameId}`));

            } catch (error) {
                console.error(chalk.red('[VELHA-UTILS] Erro ao rejeitar desafio:'), error);
            }
        }
    },

    // Comando para cancelar um jogo em andamento
    cancelarvelha: {
        name: 'cancelarvelha',
        aliases: ['cancelar-velha', 'sair-velha', 'sairvelha'],
        description: 'Cancela o jogo da velha em andamento',
        
        async execute({ lux, from, msg, sender, isGroup }) {
            try {
                if (!isGroup) return;

                // Carregar o mapa de jogos na primeira execução
                if (!velhaGames) {
                    const velhaModule = require('./velha.js');
                    velhaGames = velhaModule.velhaGames;
                }

                // Procurar um jogo em andamento com este jogador
                const jogo = encontrarJogoEmAndamento(from, sender);

                if (!jogo) {
                    return await lux.sendMessage(from, { 
                        text: '❌ Você não está em nenhum jogo da velha!' 
                    }, { quoted: msg });
                }

                // Cancelar o jogo
                jogo.status = 'cancelled';

                const outroJogador = jogo.player1.id === sender ? jogo.player2.name : jogo.player1.name;
                const mensagem = `⛔ *JOGO CANCELADO!*\n\n${sender.split('@')[0]} cancelou o jogo da velha.\n\nDesafio para ${outroJogador} foi cancelado.`;

                await lux.sendMessage(from, { text: mensagem });

                velhaGames.delete(jogo.gameId);

                console.log(chalk.yellow(`[VELHA] Jogo cancelado: ${jogo.gameId}`));

            } catch (error) {
                console.error(chalk.red('[VELHA-UTILS] Erro ao cancelar jogo:'), error);
            }
        }
    },

    // Comando para ver estatísticas
    velha_stats: {
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
                const stats = db.statistics[sender];

                if (!stats) {
                    return await lux.sendMessage(from, { 
                        text: '📊 Você ainda não jogou nenhuma partida de Jogo da Velha!' 
                    }, { quoted: msg });
                }

                const winRate = stats.total_games > 0 
                    ? ((stats.wins / stats.total_games) * 100).toFixed(1) 
                    : 0;

                const mensagem = `📊 *ESTATÍSTICAS DO JOGO DA VELHA*\n\n👤 Jogador: *${pushName}*\n\n🎮 Total de Partidas: *${stats.total_games}*\n✅ Vitórias: *${stats.wins}*\n❌ Derrotas: *${stats.losses}*\n🤝 Empates: *${stats.draws}*\n\n📈 Taxa de Vitória: *${winRate}%*`;

                await lux.sendMessage(from, { text: mensagem }, { quoted: msg });

            } catch (error) {
                console.error(chalk.red('[VELHA-UTILS] Erro ao buscar estatísticas:'), error);
                await lux.sendMessage(from, { 
                    text: '❌ Erro ao buscar estatísticas!' 
                }, { quoted: msg });
            }
        }
    },

    // Comando para ver ranking do Jogo da Velha
    velha_rank: {
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
                        text: '🏆 Nenhuma partida foi jogada ainda neste grupo!' 
                    }, { quoted: msg });
                }

                const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
                const stats = Object.values(db.statistics);

                if (stats.length === 0) {
                    return await lux.sendMessage(from, { 
                        text: '🏆 Nenhuma partida foi jogada ainda neste grupo!' 
                    }, { quoted: msg });
                }

                // Ordenar por vitórias
                stats.sort((a, b) => b.wins - a.wins);

                let mensagem = '🏆 *RANKING - JOGO DA VELHA* 🏆\n\n';

                stats.slice(0, 10).forEach((stat, index) => {
                    const posicao = index + 1;
                    const emoji = posicao === 1 ? '🥇' : posicao === 2 ? '🥈' : posicao === 3 ? '🥉' : `#${posicao}`;
                    const winRate = stat.total_games > 0 
                        ? ((stat.wins / stat.total_games) * 100).toFixed(0) 
                        : 0;

                    mensagem += `${emoji} *${stat.nome}*\n`;
                    mensagem += `   Vitórias: ${stat.wins} | Derrotas: ${stat.losses} | Empates: ${stat.draws}\n`;
                    mensagem += `   Taxa: ${winRate}%\n\n`;
                });

                await lux.sendMessage(from, { text: mensagem }, { quoted: msg });

            } catch (error) {
                console.error(chalk.red('[VELHA-UTILS] Erro ao buscar ranking:'), error);
                await lux.sendMessage(from, { 
                    text: '❌ Erro ao buscar ranking!' 
                }, { quoted: msg });
            }
        }
    }
};

// ===== FUNÇÕES AUXILIARES =====

function encontrarDesafioAguardando(groupId, playerId) {
    for (const [gameId, jogo] of velhaGames) {
        if (jogo.groupId === groupId && jogo.status === 'waiting' && jogo.player2.id === playerId) {
            return jogo;
        }
    }
    return null;
}

function encontrarJogoEmAndamento(groupId, playerId) {
    for (const [gameId, jogo] of velhaGames) {
        if (jogo.groupId === groupId && jogo.status === 'playing') {
            if (jogo.player1.id === playerId || jogo.player2.id === playerId) {
                return jogo;
            }
        }
    }
    return null;
}

