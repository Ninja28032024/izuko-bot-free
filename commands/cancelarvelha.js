// commands/cancelarvelha.js
// Comando para cancelar um jogo da velha em andamento

const chalk = require('chalk');

// Importar o mapa de jogos
let velhaGames;

module.exports = {
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

            const senderNumber = sender.split('@')[0];
            const outroJogadorJid = jogo.player1.id === sender ? jogo.player2.jid : jogo.player1.jid;
            const outroJogadorNumber = outroJogadorJid.split('@')[0];
            const mensagem = `⛔ *JOGO CANCELADO!*\n\n@${senderNumber} cancelou o jogo da velha.\n\nDesafio para @${outroJogadorNumber} foi cancelado.`;

            await lux.sendMessage(from, { 
                text: mensagem,
                mentions: [sender, outroJogadorJid]
            });

            velhaGames.delete(jogo.gameId);

            console.log(chalk.yellow(`[VELHA] Jogo cancelado: ${jogo.gameId}`));

        } catch (error) {
            console.error(chalk.red('[CANCELARVELHA] Erro ao cancelar jogo:'), error);
        }
    }
};

// ===== FUNÇÕES AUXILIARES =====

function encontrarJogoEmAndamento(groupId, playerId) {
    for (const [gameId, jogo] of velhaGames) {
        if (jogo.groupId === groupId && (jogo.status === 'playing' || jogo.status === 'waiting')) {
            if (jogo.player1.id === playerId || jogo.player2.id === playerId) {
                return jogo;
            }
        }
    }
    return null;
}
