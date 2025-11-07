// Salvar como: commands/desmute.js

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'banco de dados', 'sistemas_mute.json');

const lerMuteDB = () => {
    if (!fs.existsSync(dbPath)) return {};
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
};

const salvarMuteDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

module.exports = {
    name: 'desmute',
    aliases: ['libertar', 'perdoar'],
    
    execute: async ({ lux, msg, from, isGroup, sender, areJidsSameUser }) => {
        if (!isGroup) return;

        const groupMeta = await lux.groupMetadata(from);
        const senderIsAdmin = groupMeta.participants.find(p => areJidsSameUser(p.id, sender))?.admin;

        if (!senderIsAdmin) return await lux.sendMessage(from, { text: 'Apenas generais podem quebrar o selo de silêncio.' }, { quoted: msg });

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        let targetId = quoted ? msg.message.extendedTextMessage.contextInfo.participant : mentions?.[0];

        if (!targetId) return await lux.sendMessage(from, { text: 'Mestre, indique o alvo a ser perdoado.' }, { quoted: msg });

        const db = lerMuteDB();
        if (db[from] && db[from][targetId]) {
            delete db[from][targetId];
            salvarMuteDB(db);
            await lux.sendMessage(from, { 
                text: `✅ *JUTSU DE LIBERTAÇÃO* ✅\n\nO selo de silêncio sobre @${targetId.split('@')[0]} foi quebrado por um general. Sua voz foi restaurada.`, 
                mentions: [targetId] 
            });
        } else {
            await lux.sendMessage(from, { text: `O guerreiro @${targetId.split('@')[0]} não se encontra sob nenhum jutsu de silêncio.`, mentions: [targetId] });
        }
    }
};
