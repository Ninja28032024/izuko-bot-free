// Salvar como: commands/advertir.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'banco de dados', 'advertencias.json');

// Função para ler o banco de dados de advertências
const lerAdvertenciasDB = () => {
    try {
        if (fs.existsSync(dbPath)) {
            return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        }
    } catch (e) { console.error("Erro ao ler advertencias.json:", e); }
    return {}; // Retorna um objeto vazio se não existir
};

// Função para salvar o banco de dados
const salvarAdvertenciasDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

module.exports = {
    name: 'advertir',
    aliases: ['adv'],

    execute: async ({ lux, msg, from, isGroup, sender, areJidsSameUser, settings }) => {
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Mestre, este jutsu de disciplina só pode ser aplicado em um clã (grupo).' }, { quoted: msg });
        }

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;
        const botIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, settings.botLid))?.admin;

        if (!senderIsAdmin) {
            return await lux.sendMessage(from, { text: 'Apenas os generais (admins) podem aplicar advertências.' }, { quoted: msg });
        }
        if (!botIsAdmin) {
            return await lux.sendMessage(from, { text: 'Não possuo a patente de general para executar este decreto de disciplina.' }, { quoted: msg });
        }

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        let targetId = quoted ? msg.message.extendedTextMessage.contextInfo.participant : mentions?.[0];
        
        if (!targetId) {
            return await lux.sendMessage(from, { text: 'General, indique o guerreiro a ser advertido marcando-o ou respondendo a uma de suas mensagens.' }, { quoted: msg });
        }

        // --- SELO DE IMUNIDADE ---
        const isTargetOwner = areJidsSameUser(targetId, settings.ownerNumber);
        const targetIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, targetId))?.admin;

        if (isTargetOwner) {
            return await lux.sendMessage(from, { text: '🛡️ *IMUNIDADE SUPREMA* 🛡️\n\nÉ uma heresia tentar advertir o Mestre Supremo. A autoridade dele é absoluta.' }, { quoted: msg });
        }
        if (targetIsAdmin) {
            return await lux.sendMessage(from, { text: '🛡️ *IMUNIDADE HIERÁRQUICA* 🛡️\n\nNão posso advertir outro general. A hierarquia do clã é sagrada.' }, { quoted: msg });
        }
        // --- FIM DO SELO ---

        const db = lerAdvertenciasDB();
        if (!db[from]) db[from] = {};
        if (!db[from][targetId]) db[from][targetId] = 0;

        db[from][targetId]++;
        const totalAdvs = db[from][targetId];
        salvarAdvertenciasDB(db);

        const targetName = targetId.split('@')[0];

        if (totalAdvs >= 4) {
            // Punição final: Banimento
            await lux.sendMessage(from, { 
                text: `☠️ *SENTENÇA DE EXÍLIO POR INSUBORDINAÇÃO* ☠️\n\nO guerreiro @${targetName} acumulou ${totalAdvs} advertências e desafiou a ordem do clã. O exílio é sua punição final.`,
                mentions: [targetId]
            });
            await lux.groupParticipantsUpdate(from, [targetId], 'remove');
            // Zera as advertências após o banimento
            delete db[from][targetId];
            salvarAdvertenciasDB(db);
        } else {
            // Notificação de advertência
            await lux.sendMessage(from, { 
                text: `⚠️ *ADVERTÊNCIA APLICADA* ⚠️\n\nO guerreiro @${targetName} recebeu uma advertência de um general.\n\n*Total de Advertências:* ${totalAdvs}/4`,
                mentions: [targetId]
            });
        }
    }
};
