// Salvar como: commands/remover-advs.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'banco de dados', 'advertencias.json');

const lerAdvertenciasDB = () => {
    try {
        if (fs.existsSync(dbPath)) {
            return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        }
    } catch (e) { console.error("Erro ao ler advertencias.json:", e); }
    return {};
};

const salvarAdvertenciasDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

module.exports = {
    name: 'remover-advs',
    aliases: ['perdoar-advs'],

    execute: async ({ lux, msg, from, isGroup, sender, areJidsSameUser }) => {
        if (!isGroup) {
            return await lux.sendMessage(from, { text: 'Este jutsu de clemência só pode ser invocado dentro de um clã (grupo).' }, { quoted: msg });
        }

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;

        if (!senderIsAdmin) {
            return await lux.sendMessage(from, { text: 'Apenas generais podem conceder o perdão e remover advertências.' }, { quoted: msg });
        }

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        let targetId = quoted ? msg.message.extendedTextMessage.contextInfo.participant : mentions?.[0];

        if (!targetId) {
            return await lux.sendMessage(from, { text: 'General, indique o guerreiro a ser perdoado.' }, { quoted: msg });
        }

        const db = lerAdvertenciasDB();
        
        if (db[from] && db[from][targetId]) {
            delete db[from][targetId]; // Remove o registro de advertências do usuário
            salvarAdvertenciasDB(db);

            await lux.sendMessage(from, {
                text: `✨ *ATO DE CLEMÊNCIA* ✨\n\nPor decreto de um general, todas as advertências do guerreiro @${targetId.split('@')[0]} foram removidas. Sua ficha disciplinar está limpa.`,
                mentions: [targetId]
            });
        } else {
            await lux.sendMessage(from, {
                text: `O guerreiro @${targetId.split('@')[0]} não possui advertências registradas para serem removidas.`,
                mentions: [targetId]
            });
        }
    }
};
