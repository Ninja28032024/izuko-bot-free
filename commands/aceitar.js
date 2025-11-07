// commands/aceitar.js
// Comando para aceitar um desafio de Jogo da Velha

const chalk = require('chalk');

// Importar o mapa de jogos
let velhaGames;

module.exports = {
    name: 'aceitar',
    aliases: ['accept', 'sim'],
    description: 'Aceita um desafio de Jogo da Velha',
    
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

            const player1Number = jogo.player1.jid.split('@')[0];
            const player2Number = jogo.player2.jid.split('@')[0];
            const mensagem = `✅ *@${sender.split('@')[0]} ACEITOU O DESAFIO!*\n\n${boardText}\n\n👤 @${player1Number} (❌ X) vs @${player2Number} (⭕ O)\n\n🎮 Começando o jogo!\n\n@${player1Number}, é sua vez! Digite um número (1-9).`;

            await lux.sendMessage(from, { 
                text: mensagem,
                mentions: [jogo.player1.jid, jogo.player2.jid]
            });

            console.log(chalk.green(`[VELHA] Desafio aceito: ${jogo.gameId}`));

        } catch (error) {
            console.error(chalk.red('[ACEITAR] Erro ao aceitar desafio:'), error);
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
