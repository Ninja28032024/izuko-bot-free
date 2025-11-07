// commands/velha-jogar.js
// Processa os movimentos durante um jogo da velha
// VERSÃO CORRIGIDA COM EMOJIS DE NÚMEROS E RETORNO DE STATUS

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Importar o mapa de jogos do arquivo principal
let velhaGames;
let renderizarTabuleiro;
let encontrarJogoAtivoNoGrupo;
let emojiNumeros;

module.exports = {
    name: 'velha-jogar',
    isHidden: true, // Comando interno, não aparece na lista
    
    async execute({ lux, from, msg, sender, body, isGroup, settings, pushName }) {
        try {
            if (!isGroup) return false;

            // Carregar as funções do módulo principal na primeira execução
            if (!velhaGames) {
                const velhaModule = require('./velha.js');
                velhaGames = velhaModule.velhaGames;
                renderizarTabuleiro = velhaModule.renderizarTabuleiro;
                encontrarJogoAtivoNoGrupo = velhaModule.encontrarJogoAtivoNoGrupo;
                emojiNumeros = velhaModule.emojiNumeros;
            }

            const numero = parseInt(body);
            if (isNaN(numero) || numero < 1 || numero > 9) return false;

            // Procurar jogo ativo neste grupo com este jogador
            const jogo = encontrarJogoAtivo(from, sender);
            if (!jogo) return false;

            // Se o jogo está aguardando aceitar/rejeitar, ignorar
            if (jogo.status === 'waiting') return false;

            // Verificar se é a vez do jogador
            const ehPlayer1 = jogo.player1.id === sender;
            const ehPlayer2 = jogo.player2.id === sender;
            
            if (!ehPlayer1 && !ehPlayer2) return false;

            const ehVezDoJogador = 
                (jogo.currentPlayer === 'player1' && ehPlayer1) ||
                (jogo.currentPlayer === 'player2' && ehPlayer2);

            if (!ehVezDoJogador) {
                await lux.sendMessage(from, { 
                    text: `⏳ Aguarde sua vez!` 
                }, { quoted: msg });
                return true; // Retorna true porque processou (mesmo que seja erro)
            }

            // Fazer o movimento
            const simbolo = jogo.currentPlayer === 'player1' ? 'X' : 'O';
            const sucesso = fazerMovimento(jogo.board, numero, simbolo);

            if (!sucesso) {
                await lux.sendMessage(from, { 
                    text: `❌ Posição ${numero} já está ocupada! Escolha outra.` 
                }, { quoted: msg });
                return true; // Retorna true porque processou (mesmo que seja erro)
            }

            jogo.moves.push({ 
                jogador: jogo.currentPlayer, 
                posicao: numero,
                simbolo: simbolo,
                timestamp: Date.now()
            });

            console.log(chalk.blue(`[VELHA] Movimento: ${jogo.gameId} - Jogador ${jogo.currentPlayer} jogou na posição ${numero}`));

            // Verificar vitória ou empate
            const vencedor = verificarVencedor(jogo.board);
            const empate = verificarEmpate(jogo.board);

            if (vencedor) {
                // Alguém venceu
                jogo.status = 'won';
                jogo.winner = vencedor === 'X' ? 'player1' : 'player2';
                
                const boardText = renderizarTabuleiro(jogo.board);
                const vencedorJid = jogo.winner === 'player1' ? jogo.player1.jid : jogo.player2.jid;
                const vencedorNumber = vencedorJid.split('@')[0];
                
                const mensagemVitoria = `🎉 @${vencedorNumber} VENCEU! 🎉\n\n${boardText}\n\n⚔️ Parabéns! Você conquistou a vitória!`;
                
                await lux.sendMessage(from, { 
                    text: mensagemVitoria,
                    mentions: [vencedorJid]
                });

                salvarResultado(jogo);
                velhaGames.delete(jogo.gameId);

                console.log(chalk.green(`[VELHA] Jogo finalizado: ${jogo.gameId} - Vencedor: @${vencedorNumber}`));
                return true;

            } else if (empate) {
                // Empate
                jogo.status = 'draw';
                
                const boardText = renderizarTabuleiro(jogo.board);
                const mensagemEmpate = `🤝 *EMPATE!* 🤝\n\n${boardText}\n\nAmbos jogaram muito bem! Ninguém conseguiu vencer.`;
                
                await lux.sendMessage(from, { text: mensagemEmpate });

                salvarResultado(jogo);
                velhaGames.delete(jogo.gameId);

                console.log(chalk.yellow(`[VELHA] Jogo finalizado: ${jogo.gameId} - Resultado: Empate`));
                return true;

            } else {
                // Próximo turno
                jogo.currentPlayer = jogo.currentPlayer === 'player1' ? 'player2' : 'player1';

                // Multiplayer - mostrar tabuleiro para o próximo jogador
                const boardText = renderizarTabuleiro(jogo.board);
                const proximoJogadorJid = jogo.currentPlayer === 'player1' ? jogo.player1.jid : jogo.player2.jid;
                const proximoJogadorNumber = proximoJogadorJid.split('@')[0];
                const simboloProximo = jogo.currentPlayer === 'player1' ? '❌' : '⭕';
                
                const mensagem = `${boardText}\n\n🎮 Turno de @${proximoJogadorNumber} (${simboloProximo})\n\nDigite um número (1-9) para fazer sua jogada.`;
                
                await lux.sendMessage(from, { 
                    text: mensagem,
                    mentions: [proximoJogadorJid]
                });
                return true;
            }

        } catch (error) {
            console.error(chalk.red('[VELHA-JOGAR] Erro ao processar movimento:'), error);
            return false;
        }
    }
};

// ===== FUNÇÕES AUXILIARES =====

function encontrarJogoAtivo(groupId, playerId) {
    for (const [gameId, jogo] of velhaGames) {
        if (jogo.groupId === groupId && jogo.status === 'playing') {
            if (jogo.player1.id === playerId || jogo.player2.id === playerId) {
                return jogo;
            }
        }
    }
    return null;
}

function fazerMovimento(board, posicao, simbolo) {
    const linha = Math.floor((posicao - 1) / 3);
    const coluna = (posicao - 1) % 3;
    
    if (board[linha][coluna] !== null) {
        return false; // Posição ocupada
    }
    
    board[linha][coluna] = simbolo;
    return true;
}

function verificarVencedor(board) {
    // Verificar linhas
    for (let i = 0; i < 3; i++) {
        if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
            return board[i][0];
        }
    }
    
    // Verificar colunas
    for (let j = 0; j < 3; j++) {
        if (board[0][j] && board[0][j] === board[1][j] && board[1][j] === board[2][j]) {
            return board[0][j];
        }
    }
    
    // Verificar diagonal principal (↘)
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return board[0][0];
    }
    
    // Verificar diagonal secundária (↙)
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return board[0][2];
    }
    
    return null;
}

function verificarEmpate(board) {
    return board.every(linha => linha.every(celula => celula !== null));
}

// Função removida - Jogo contra bot não está mais disponível

function salvarResultado(jogo) {
    const dbPath = path.join(__dirname, '..', 'banco de dados', 'velha_games.json');
    let db = { completed_games: [], statistics: {} };

    try {
        if (fs.existsSync(dbPath)) {
            db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
            // Garantir que completed_games existe
            if (!db.completed_games) {
                db.completed_games = [];
            }
            // Garantir que statistics existe
            if (!db.statistics) {
                db.statistics = {};
            }
        }
    } catch (error) {
        console.error(chalk.red('[VELHA] Erro ao ler banco de dados:'), error);
        db = { completed_games: [], statistics: {} };
    }

    // Adicionar jogo completo ao histórico
    db.completed_games.push({
        gameId: jogo.gameId,
        groupId: jogo.groupId,
        player1: {
            id: jogo.player1.id,
            name: jogo.player1.name,
            symbol: jogo.player1.symbol
        },
        player2: {
            id: jogo.player2.id,
            name: jogo.player2.name,
            symbol: jogo.player2.symbol
        },
        winner: jogo.winner,
        status: jogo.status,
        moves: jogo.moves.length,
        duration: Date.now() - jogo.createdAt,
        completedAt: Date.now()
    });

    // Atualizar estatísticas do jogador 1
    if (!db.statistics[jogo.player1.id]) {
        db.statistics[jogo.player1.id] = {
            nome: jogo.player1.name,
            wins: 0,
            losses: 0,
            draws: 0,
            total_games: 0
        };
    }

    db.statistics[jogo.player1.id].total_games++;

    if (jogo.winner === 'player1') {
        db.statistics[jogo.player1.id].wins++;
    } else if (jogo.winner === 'player2') {
        db.statistics[jogo.player1.id].losses++;
    } else {
        db.statistics[jogo.player1.id].draws++;
    }

    // Atualizar estatísticas do jogador 2
    if (!db.statistics[jogo.player2.id]) {
        db.statistics[jogo.player2.id] = {
            nome: jogo.player2.name,
            wins: 0,
            losses: 0,
            draws: 0,
            total_games: 0
        };
    }

    db.statistics[jogo.player2.id].total_games++;

    if (jogo.winner === 'player2') {
        db.statistics[jogo.player2.id].wins++;
    } else if (jogo.winner === 'player1') {
        db.statistics[jogo.player2.id].losses++;
    } else {
        db.statistics[jogo.player2.id].draws++;
    }

    try {
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        console.log(chalk.green('[VELHA] Resultado salvo no banco de dados'));
    } catch (error) {
        console.error(chalk.red('[VELHA] Erro ao salvar resultado:'), error);
    }
}

// Exportar funções para uso em outros módulos
module.exports.verificarVencedor = verificarVencedor;
module.exports.verificarEmpate = verificarEmpate;
module.exports.fazerMovimento = fazerMovimento;
