// Salvar como: commands/zerar-caracoroa.js
const fs = require('fs');
const path = require('path');

const cooldownDbPath = path.join(__dirname, '..', 'banco de dados', 'cooldown_cara-coroa.json');

const lerDB = () => {
    if (!fs.existsSync(cooldownDbPath)) return {};
    return JSON.parse(fs.readFileSync(cooldownDbPath, 'utf-8'));
};
const salvarDB = (data) => {
    fs.writeFileSync(cooldownDbPath, JSON.stringify(data, null, 2));
};

module.exports = {
    name: 'zerar-caracoroa',
    // Sem aliases, conforme ordenado.

    execute: async ({ lux, msg, from, sender, isOwner }) => {
        // --- SELO DE AUTORIDADE SUPREMA ---
        if (!isOwner) {
            return await lux.sendMessage(from, { text: '🛡️ *ACESSO NEGADO* 🛡️\n\nEste jutsu de manipulação do destino é reservado ao Mestre Supremo.' }, { quoted: msg });
        }

        const targetId = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || sender;
        const isSelf = targetId === sender;
        
        const cooldownDb = lerDB();

        if (cooldownDb[targetId] && cooldownDb[targetId].usos > 0) {
            // Zera os usos e o tempo de expiração para o alvo.
            cooldownDb[targetId].usos = 0;
            cooldownDb[targetId].expiraEm = 0;
            salvarDB(cooldownDb);

            if (isSelf) {
                await lux.sendMessage(from, { text: '✨ *DESTINO REESCRITO* ✨\n\nMestre, suas próprias tentativas no Jogo do Destino foram zeradas. A sorte aguarda novamente.' }, { quoted: msg });
            } else {
                await lux.sendMessage(from, { 
                    text: `✨ *CLEMÊNCIA DO MESTRE* ✨\n\nPor decreto do Mestre, as tentativas do guerreiro @${targetId.split('@')[0]} no Jogo do Destino foram perdoadas e zeradas.`,
                    mentions: [targetId]
                });
            }
        } else {
            if (isSelf) {
                await lux.sendMessage(from, { text: 'Mestre, Vossa Senhoria não possui tentativas a serem zeradas.' }, { quoted: msg });
            } else {
                await lux.sendMessage(from, { text: `Mestre, o guerreiro @${targetId.split('@')[0]} não possui tentativas a serem perdoadas.`, mentions: [targetId] });
            }
        }
    }
};
