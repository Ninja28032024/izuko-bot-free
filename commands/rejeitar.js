// commands/rejeitar.js
// Comando para rejeitar um desafio de Jogo da Velha

const chalk = require('chalk');

// Importar o mapa de jogos
let velhaGames;

module.exports = {
    name: 'rejeitar',
    aliases: ['reject', 'nao', 'não'],
    description: 'Rejeita um desafio de Jogo da Velha',
    
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

            const player1Number = jogo.player1.jid.split('@')[0];
            const player2Number = sender.split('@')[0];
            const mensagem = `❌ *@${player2Number} REJEITOU O DESAFIO!*\n\n@${player1Number}, seu desafio foi recusado. Tente novamente com outro jogador!`;

            await lux.sendMessage(from, { 
                text: mensagem,
                mentions: [jogo.player1.jid, sender]
            });

            velhaGames.delete(jogo.gameId);

            console.log(chalk.yellow(`[VELHA] Desafio rejeitado: ${jogo.gameId}`));

        } catch (error) {
            console.error(chalk.red('[REJEITAR] Erro ao rejeitar desafio:'), error);
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
