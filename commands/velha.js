// commands/velha.js
// Sistema de Jogo da Velha - APENAS MULTIPLAYER
// VERSÃO CORRIGIDA COM EMOJIS DE NÚMEROS E MENÇÕES CORRETAS

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Armazena jogos ativos em memória (será exportado para uso em outros módulos)
const velhaGames = new Map();

// Mapa de emojis de números
const emojiNumeros = {
    '1': '1️⃣',
    '2': '2️⃣',
    '3': '3️⃣',
    '4': '4️⃣',
    '5': '5️⃣',
    '6': '6️⃣',
    '7': '7️⃣',
    '8': '8️⃣',
    '9': '9️⃣'
};

module.exports = {
    name: 'velha',
    aliases: ['jogo-velha', 'tictactoe', 'jv'],
    description: 'Jogo da Velha - Desafie outro jogador',
    usage: '!velha @usuário',
    cooldown: 5,
    
    async execute({ lux, from, msg, args, sender, pushName, isGroup, settings }) {
        try {
            // Verificar se é em grupo
            if (!isGroup) {
                return await lux.sendMessage(from, { 
                    text: '❌ *Este jogo só pode ser jogado em grupos!*' 
                }, { quoted: msg });
            }

            // Verificar se há um alvo mencionado
            if (args.length === 0) {
                return await lux.sendMessage(from, { 
                    text: `📋 *USO DO COMANDO:*\n\n• ${settings.prefix}velha @usuário - Desafiar outro jogador\n\n*Exemplo:*\n${settings.prefix}velha @João` 
                }, { quoted: msg });
            }

            // Extrair menção do contexto da mensagem
            const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            
            if (!mentions || mentions.length === 0) {
                return await lux.sendMessage(from, { 
                    text: '❌ Você precisa mencionar alguém! Use: ' + settings.prefix + 'velha @usuário' 
                }, { quoted: msg });
            }

            const targetJid = mentions[0];

            // Verificar se o usuário está tentando desafiar a si mesmo
            if (targetJid === sender) {
                return await lux.sendMessage(from, { 
                    text: '❌ Você não pode desafiar a si mesmo!' 
                }, { quoted: msg });
            }

            await iniciarDesafioMultiplayer(lux, from, msg, sender, pushName, targetJid, settings);

        } catch (error) {
            console.error(chalk.red('[VELHA] Erro ao executar comando:'), error);
            await lux.sendMessage(from, { 
                text: '❌ Erro ao iniciar o jogo. Tente novamente.' 
            }, { quoted: msg });
        }
    }
};

// ===== FUNÇÕES AUXILIARES =====

async function iniciarDesafioMultiplayer(lux, from, msg, sender, pushName, targetJid, settings) {
    // Verificar se já existe um jogo ativo neste grupo
    const jogoExistente = encontrarJogoAtivoNoGrupo(from);
    if (jogoExistente) {
        return await lux.sendMessage(from, { 
            text: '⚠️ Já existe um jogo da velha em andamento neste grupo! Aguarde o fim da partida.' 
        }, { quoted: msg });
    }

    const gameId = `${from}_${Date.now()}`;
    
    // Extrair apenas o número do JID para menção
    const targetNumber = targetJid.split('@')[0];
    
    const jogo = {
        gameId,
        groupId: from,
        player1: { 
            id: sender, 
            name: pushName, 
            symbol: 'X',
            jid: sender
        },
        player2: { 
            id: targetJid, 
            name: `@${targetNumber}`, 
            symbol: 'O',
            jid: targetJid
        },
        board: [[null, null, null], [null, null, null], [null, null, null]],
        currentPlayer: 'player1',
        status: 'waiting',
        winner: null,
        moves: [],
        createdAt: Date.now(),
        timeout: 300000, // 5 minutos
        type: 'multiplayer'
    };

    velhaGames.set(gameId, jogo);

    const boardText = renderizarTabuleiro(jogo.board);
    const mensagem = `🎮 *DESAFIO DE JOGO DA VELHA* 🎮\n\n${boardText}\n\n👤 *${pushName}* desafiou @${targetNumber} para jogar!\n\n⭕ @${targetNumber}, responda com:\n✅ ${settings.prefix}aceitar\n❌ ${settings.prefix}rejeitar\n\n⏳ Tempo limite: 5 minutos`;

    await lux.sendMessage(from, { 
        text: mensagem,
        mentions: [targetJid] // Mencionar o jogador desafiado
    }, { quoted: msg });

    console.log(chalk.cyan(`[VELHA] Desafio iniciado: ${gameId} - ${pushName} vs @${targetNumber}`));
}

function renderizarTabuleiro(board) {
    const simbolos = {
        'X': '❌',
        'O': '⭕',
        null: null
    };

    let texto = '';
    let numero = 1;
    
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const celula = board[i][j];
            const display = simbolos[celula];
            
            if (display) {
                texto += display;
            } else {
                // Usar emoji de número ao invés de número simples
                texto += emojiNumeros[numero.toString()];
            }
            
            texto += ' ';
            numero++;
        }
        texto += '\n';
    }
    
    return texto;
}

function encontrarJogoAtivoNoGrupo(groupId) {
    for (const [gameId, jogo] of velhaGames) {
        if (jogo.groupId === groupId && (jogo.status === 'playing' || jogo.status === 'waiting')) {
            return jogo;
        }
    }
    return null;
}

// Exportar para uso em outros módulos
module.exports.velhaGames = velhaGames;
module.exports.renderizarTabuleiro = renderizarTabuleiro;
module.exports.encontrarJogoAtivoNoGrupo = encontrarJogoAtivoNoGrupo;
module.exports.emojiNumeros = emojiNumeros;
