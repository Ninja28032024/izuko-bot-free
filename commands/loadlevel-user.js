// Salvar como: commands/loadlevel-user.js
const fs = require('fs');
const path = require('path');

// Define os caminhos para os dois cofres de memória
const rankingDbPath = path.join(__dirname, '..', 'banco de dados', 'ranking.json');
const backupDbPath = path.join(__dirname, '..', 'banco de dados', 'backup-rank.json');

// Função genérica para ler qualquer um dos arquivos .json
const lerDB = (caminho) => {
    if (!fs.existsSync(caminho)) return {};
    try {
        return JSON.parse(fs.readFileSync(caminho, 'utf-8'));
    } catch (e) {
        console.error(`Erro ao ler o arquivo ${caminho}:`, e);
        return {};
    }
};

// Função para salvar os dados no ranking principal
const salvarRankingDB = (dados) => {
    fs.writeFileSync(rankingDbPath, JSON.stringify(dados, null, 2));
};

module.exports = {
    name: 'loadlevel-user',
    // Sem aliases, conforme ordenado.

    execute: async ({ lux, msg, from, isGroup, isOwner }) => {
        // --- SELO DE AUTORIDADE SUPREMA ---
        if (!isOwner) {
            return await lux.sendMessage(from, { text: '🛡️ *ACESSO NEGADO* 🛡️\n\nEste jutsu de ressurreição de poder é reservado ao Mestre Supremo.' }, { quoted: msg });
        }
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, a alma de um guerreiro só pode ser restaurada no clã onde ela foi forjada.' }, { quoted: msg });
        }

        const targetId = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!targetId) {
            return await lux.sendMessage(from, { text: 'Sintaxe incorreta. Use: `loadlevel-user @guerreiro`' }, { quoted: msg });
        }

        const backupDb = lerDB(backupDbPath);
        const backupDoMembro = backupDb[from]?.[targetId];

        // Verifica se existe um backup para aquele guerreiro
        if (!backupDoMembro) {
            return await lux.sendMessage(from, { text: `Mestre, não encontrei uma alma selada para o guerreiro @${targetId.split('@')[0]}. O backup não existe.`, mentions: [targetId] });
        }

        const rankingDb = lerDB(rankingDbPath);
        if (!rankingDb[from]) {
            rankingDb[from] = { membros: {} };
        }

        // Remove o campo 'timestamp' antes de restaurar, para manter o ranking.json limpo
        const { timestamp, ...dadosParaRestaurar } = backupDoMembro;

        // Restaura os dados no ranking principal
        rankingDb[from].membros[targetId] = dadosParaRestaurar;
        salvarRankingDB(rankingDb);

        await lux.sendMessage(from, { 
            text: `🌀 *ALMA RESTAURADA* 🌀\n\nMestre, por seu decreto, a essência de poder do guerreiro @${targetId.split('@')[0]} foi invocada e restaurada com sucesso.`, 
            mentions: [targetId] 
        });
    }
};
