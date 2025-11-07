// Salvar como: commands/converterxp-user.js
const fs = require('fs');
const path = require('path');

// Caminho para o cofre de memórias do ranking
const dbPath = path.join(__dirname, '..', 'banco de dados', 'ranking.json');

// Funções para ler e salvar no cofre de memórias
const lerDB = () => {
    if (!fs.existsSync(dbPath)) return {};
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
};
const salvarDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Constantes do sistema de ranking (para manter a consistência)
const PONTOS_POR_XP = 200; // Cada 1 XP vale 200 Pontos
const PONTOS_PARA_UPAR = 3000; // Pontos necessários para subir de nível

/**
 * Função para processar a ascensão de patente de um guerreiro.
 * Esta função é uma versão local para este comando, garantindo que ele funcione de forma independente.
 */
async function processarUpgrade(lux, from, sender, pushName, membro, db) {
    let subiuDeNivel = false;
    while (membro.pontos >= PONTOS_PARA_UPAR) {
        membro.pontos -= PONTOS_PARA_UPAR;
        membro.nivel = (membro.nivel || 1) + 1;
        subiuDeNivel = true;
    }

    if (subiuDeNivel) {
        salvarDB(db); // Salva o estado atualizado após a(s) promoção(ões)
        await lux.sendMessage(from, { text: `🚀 *ASCENSÃO DE PATENTE* 🚀\n\nO poder forjado do guerreiro @${sender.split('@')[0]} o fez ascender para a *Patente ${membro.nivel}*!`, mentions: [sender] });
    }
}

module.exports = {
    name: 'converterxp-user',
    // Sem aliases, conforme ordenado.

    execute: async ({ lux, msg, from, isGroup, isOwner }) => {
        // --- SELO DE AUTORIDADE SUPREMA ---
        if (!isOwner) {
            return await lux.sendMessage(from, { text: '🛡️ *ACESSO NEGADO* 🛡️\n\nEste jutsu de forja de poder alheio é reservado ao Mestre Supremo.' }, { quoted: msg });
        }
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, a forja de poder só pode ser realizada dentro de um clã.' }, { quoted: msg });
        }

        const targetId = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!targetId) {
            return await lux.sendMessage(from, { text: 'Sintaxe incorreta. Use: `converterxp-user @guerreiro`' }, { quoted: msg });
        }

        const db = lerDB();
        const membro = db[from]?.membros?.[targetId];

        if (!membro || membro.xp === 0) {
            return await lux.sendMessage(from, { text: `Mestre, o guerreiro @${targetId.split('@')[0]} não possui XP para ser forjado em Pontos.`, mentions: [targetId] });
        }

        const xpConvertido = membro.xp;
        const pontosGanhos = xpConvertido * PONTOS_POR_XP;
        
        // Zera o XP e adiciona os Pontos ganhos
        membro.xp = 0;
        membro.pontos += pontosGanhos;

        // Salva o estado antes de verificar o upgrade
        salvarDB(db);

        await lux.sendMessage(from, { 
            text: `🔥 *FORJA DE PODER POR DECRETO* 🔥\n\nMestre, por sua ordem, *${xpConvertido} XP* do guerreiro @${targetId.split('@')[0]} foram forjados em *${pontosGanhos} Pontos*!`,
            mentions: [targetId]
        });

        // Verifica se a conversão resultou em uma ascensão de patente
        // Passamos 'db' que já foi lido e modificado
        await processarUpgrade(lux, from, targetId, membro.nome, membro, db);
    }
};
